using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]

public class StripeController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IConfiguration _config;
  private readonly IMapper _mapper;

  public StripeController(AppDbContext context, IConfiguration config, IMapper mapper)
  {
    _context = context;
    _config = config;
    _mapper = mapper;
  }

[HttpPost("create-payment-intent")]
  public async Task<IActionResult> CreatePaymentIntentSession([FromBody] CheckoutRequest req)
  {
    if (req.Amount <= 0 )
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Bad Request",
        Detail = "Amount must be provided.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };
    }

    var checkoutTotal = (long)(req.Amount * 100);

    var options = new Stripe.PaymentIntentCreateOptions
    {
        Amount = checkoutTotal,
        Currency = "usd",
        ReceiptEmail = req.Email,
        PaymentMethodTypes = new List<string>
        {
            "card"
        },

        Description = "AD Rentals Payment",
        Metadata = new Dictionary<string, string>
        {
            { "customerEmail", req.Email },
            { "source", "ADRentalsERP" }
        }
    };

    var service = new Stripe.PaymentIntentService();
    var intent = await service.CreateAsync(options);

    return Ok(new { client_secret = intent.ClientSecret });
  }
}



