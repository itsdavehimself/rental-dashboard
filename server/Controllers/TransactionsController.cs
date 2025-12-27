using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using server.DTOs;
using Stripe;

[Authorize]
[ApiController]
[Route("/api/[controller]")]

public class TransactionsController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IConfiguration _config;
  private readonly IMapper _mapper;

  public TransactionsController(AppDbContext context, IConfiguration config, IMapper mapper)
  {
    _context = context;
    _config = config;
    _mapper = mapper;
  }

  [HttpPost]
  public async Task<IActionResult> CreatePayment(TransactionDto request)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    var eventRecord = await _context.Events.FirstOrDefaultAsync(e => e.Uid == request.EventUid);

    if (eventRecord == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Event not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };
    }

    var user = await _context.Users.FirstOrDefaultAsync(u => u.Uid == request.ProcessedByUid);

    if (user == null)
     {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "User not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };
    }

    PaymentMethod paymentMethod;

    if (Enum.TryParse<PaymentMethod>(request.PaymentMethod, true, out var method))
    {
      paymentMethod = method;
    }
    else
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Bad request",
        Detail = "Not a valid payment method.",
        Status = StatusCodes.Status400BadRequest
      })
      {
        StatusCode = StatusCodes.Status400BadRequest
      };  
    }

    var newTransaction = new Transaction
    {
      EventId = eventRecord.Id,
      Amount = request.Amount,
      Method = paymentMethod,
      OccurredAt = DateTime.UtcNow,
      ExternalTransactionId = request.ExternalTransactionId ?? null,
      ProcessedById = user.Id,
      Notes = request.Notes != "" ? request.Notes : null,
      Type = TransactionType.Payment
    };

    string? cardBrand = null;
    string? last4 = null;

    if (newTransaction.Method == PaymentMethod.Card && newTransaction.ExternalTransactionId != null)
    {
      var chargeService = new ChargeService();

      var charges = await chargeService.ListAsync(new ChargeListOptions
      {
        PaymentIntent = newTransaction.ExternalTransactionId,
        Limit = 5
      });

      var charge = charges.Data.FirstOrDefault(c => c.Status == "succeeded");

      var card = charge?
        .PaymentMethodDetails?
        .Card;

      if (card != null)
      {
        cardBrand = card.Brand;
        last4 = card.Last4;
      }
    }

    newTransaction.CardBrand = cardBrand;
    newTransaction.Last4 = last4;

     _context.Transactions.Add(newTransaction);
    await _context.SaveChangesAsync();

    var dto = _mapper.Map<TransactionResponseDto>(newTransaction);

    return Ok(dto);
  }

  [HttpPost("{uid}/refund")]
  public async Task<IActionResult> CreateRefund(TransactionRefundDto request, Guid uid)
  {
      if (!ModelState.IsValid)
      {
          return BadRequest(ModelState);
      }

      var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Uid == uid);

      if (transaction == null)
      {
          return new ObjectResult(new ProblemDetails
          {
              Title = "Not Found",
              Detail = "Transaction not found.",
              Status = StatusCodes.Status404NotFound
          })
          {
              StatusCode = StatusCodes.Status404NotFound
          };
      }

      var eventObject = await _context.Events.FirstOrDefaultAsync(e => e.Id == transaction.EventId);

      if (eventObject == null)
      {
          return new ObjectResult(new ProblemDetails
          {
              Title = "Not Found",
              Detail = "Event associated with transaction was not found.",
              Status = StatusCodes.Status404NotFound
          })
          {
              StatusCode = StatusCodes.Status404NotFound
          };
      }

      var user = await _context.Users.FirstOrDefaultAsync(u => u.Uid == request.ProcessedByUid);

      if (user == null)
      {
          return new ObjectResult(new ProblemDetails
          {
              Title = "Not Found",
              Detail = "User not found.",
              Status = StatusCodes.Status404NotFound
          })
          {
              StatusCode = StatusCodes.Status404NotFound
          };
      }

      if (transaction.Amount < request.Amount)
      {
          return new ObjectResult(new ProblemDetails
          {
              Title = "Bad Request",
              Detail = "Refund amount cannot be greater than the original payment amount.",
              Status = StatusCodes.Status400BadRequest
          })
          {
              StatusCode = StatusCodes.Status400BadRequest
          };
      }

      if (request.Notes == null)
      {
          return new ObjectResult(new ProblemDetails
          {
              Title = "Bad Request",
              Detail = "Notes cannot be empty on a refund transaction.",
              Status = StatusCodes.Status400BadRequest
          })
          {
              StatusCode = StatusCodes.Status400BadRequest
          };
      }

      PaymentMethod paymentMethod;

      if (Enum.TryParse<PaymentMethod>(request.PaymentMethod, true, out var method))
      {
          paymentMethod = method;
      }
      else
      {
          return new ObjectResult(new ProblemDetails
          {
              Title = "Bad request",
              Detail = "Not a valid payment method.",
              Status = StatusCodes.Status400BadRequest
          })
          {
              StatusCode = StatusCodes.Status400BadRequest
          };  
      }

      string? stripeRefundId = null;

      if (paymentMethod == PaymentMethod.Card && transaction.ExternalTransactionId != null)
      {
          var options = new RefundCreateOptions 
          { 
              PaymentIntent = transaction.ExternalTransactionId, 
              Reason = RefundReasons.RequestedByCustomer,
              Metadata = new Dictionary<string, string> { { "InternalNotes", request.Notes } }
          };
          
          var service = new RefundService();
          Refund refund = await service.CreateAsync(options);
          
          stripeRefundId = refund.Id;
      }

      var newTransaction = new Transaction
      {
          EventId = transaction.EventId,
          Amount = request.Amount * -1,
          Method = paymentMethod,
          OccurredAt = DateTime.UtcNow,
          ExternalTransactionId = stripeRefundId ?? request.ExternalTransactionId,
          ProcessedById = user.Id,
          Notes = request.Notes != "" ? request.Notes : null,
          Type = TransactionType.Refund,
          RelatedTransactionId = transaction.Id,
          Last4 = transaction.Last4,
          CardBrand = transaction.CardBrand
      };

      _context.Transactions.Add(newTransaction);
      await _context.SaveChangesAsync();

      var dto = _mapper.Map<TransactionResponseDto>(newTransaction);

      return Ok(dto);
  }
}