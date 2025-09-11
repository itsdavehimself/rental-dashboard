using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Dtos.Clients;
using server.DTOs;
using server.DTOs.ResidentialClient;
using server.Models;
using server.Models.Clients;
using System.Security.Claims;


namespace server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]

public class ClientController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IConfiguration _config;

  public ClientController(AppDbContext context, IConfiguration config)
  {
    _context = context;
    _config = config;
  }

  [HttpGet("residential")]
  public async Task<IActionResult> GetResidentialClients([FromQuery] int page = 1, [FromQuery] int pageSize = 25)
    {
      var totalCount = await _context.ResidentialClients.CountAsync();

      var results = await _context.ResidentialClients
        .Include(rc => rc.Person)
        .Include(rc => rc.Client)
          .ThenInclude(c => c.Addresses)
            .ThenInclude(ca => ca.Address)
        .OrderBy(rc => rc.Person.LastName)
        .ThenBy(rc => rc.Person.FirstName)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .Select(rc => new ClientSearchResultDto
        {
          Uid = rc.Client.Uid,
          Type = ClientType.Residential,
          FirstName = rc.Person.FirstName,
          LastName = rc.Person.LastName,
          Email = rc.Person.Email,
          PhoneNumber = rc.Person.PhoneNumber,
          Notes = rc.Client.Notes,
          CreatedAt = rc.Client.CreatedAt,
          BillingAddress = rc.Client.Addresses!
            .Where(a => a.Type == AddressType.Billing && a.IsPrimary)
            .Select(a => new AddressDto
            {
              Street = a.Address.Street,
              Unit = a.Address.Unit,
              City = a.Address.City,
              State = a.Address.State,
              ZipCode = a.Address.ZipCode,
              IsPrimary = a.IsPrimary
            })
            .FirstOrDefault() ?? new AddressDto()
        })
        .ToListAsync();

      var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

      return Ok(new PaginatedResponse<ClientSearchResultDto>
      {
        Page = page,
        PageSize = pageSize,
        TotalCount = totalCount,
        TotalPages = totalPages,
        Data = results
      });
    }

  [HttpGet("fuzzy-search")]
  public async Task<IActionResult> FuzzySearchClients(
    [FromQuery] string? query,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 25)
  {
    query = query?.ToLower().Trim();

    if (string.IsNullOrWhiteSpace(query))
    {
        return Ok(new PaginatedResponse<ClientSearchResultDto>
        {
            Page = page,
            PageSize = pageSize,
            TotalCount = 0,
            TotalPages = 0,
            Data = new List<ClientSearchResultDto>()
        });
    }

    var residentialQuery = _context.ResidentialClients
    .Include(rc => rc.Person)
    .Include(rc => rc.Client)
      .ThenInclude(c => c.Addresses)
        .ThenInclude(ca => ca.Address)
    .AsQueryable();

    if (!string.IsNullOrWhiteSpace(query))
    {
      residentialQuery = residentialQuery.Where(rc =>
        (rc.Person.FirstName + " " + rc.Person.LastName).ToLower().Contains(query) ||
        rc.Person.FirstName.ToLower().Contains(query) ||
        rc.Person.LastName.ToLower().Contains(query) ||
        rc.Person.Email.ToLower().Contains(query) ||
        rc.Person.PhoneNumber.ToLower().Contains(query)
    );
    }

    var residentialResults = await residentialQuery.ToListAsync();

    var mappedResidential = residentialResults.Select(rc => new ClientSearchResultDto
    {
      Uid = rc.Client.Uid,
      Type = ClientType.Residential,
      FirstName = rc.Person.FirstName,
      LastName = rc.Person.LastName,
      Email = rc.Person.Email,
      PhoneNumber = rc.Person.PhoneNumber,
      Notes = rc.Client.Notes,
      CreatedAt = rc.Client.CreatedAt,
      BillingAddress = rc.Client.Addresses!
        .Where(a => a.Type == AddressType.Billing && a.IsPrimary)
        .Select(a => new AddressDto
        {
          Street = a.Address.Street,
          Unit = a.Address.Unit,
          City = a.Address.City,
          State = a.Address.State,
          ZipCode = a.Address.ZipCode,
          IsPrimary = a.IsPrimary
        })
        .FirstOrDefault() ?? new AddressDto()
    });

    var businessQuery = _context.BusinessClients
      .Include(bc => bc.Contacts)
        .ThenInclude(c => c.Person)
      .Include(bc => bc.Client)
        .ThenInclude(c => c.Addresses)
          .ThenInclude(ca => ca.Address)
      .AsQueryable();

    if (!string.IsNullOrWhiteSpace(query))
    {
      businessQuery = businessQuery.Where(bc =>
        bc.BusinessName.ToLower().Contains(query) ||
        bc.Contacts.Any(c =>
          (c.Person.FirstName + " " + c.Person.LastName).ToLower().Contains(query) ||
          c.Person.FirstName.ToLower().Contains(query) ||
          c.Person.LastName.ToLower().Contains(query) ||
          c.Person.Email.ToLower().Contains(query) ||
          c.Person.PhoneNumber.ToLower().Contains(query)
        )
      );
    }

    var businessResults = await businessQuery.ToListAsync();

    var mappedBusiness = businessResults.Select(bc => new ClientSearchResultDto
    {
      Uid = bc.Client.Uid,
      Type = ClientType.Business,
      BusinessName = bc.BusinessName,
      FirstName = bc.Contacts.Where(c => c.IsPrimary).Select(c => c.Person.FirstName).FirstOrDefault(),
      LastName = bc.Contacts.Where(c => c.IsPrimary).Select(c => c.Person.LastName).FirstOrDefault(),
      Email = bc.Contacts.Where(c => c.IsPrimary).Select(c => c.Person.Email).FirstOrDefault(),
      PhoneNumber = bc.Contacts.Where(c => c.IsPrimary).Select(c => c.Person.PhoneNumber).FirstOrDefault(),
      Notes = bc.Client.Notes,
      CreatedAt = bc.Client.CreatedAt,
      BillingAddress = bc.Client.Addresses!
        .Where(a => a.Type == AddressType.Billing && a.IsPrimary)
        .Select(a => new AddressDto
        {
          Street = a.Address.Street,
          Unit = a.Address.Unit,
          City = a.Address.City,
          State = a.Address.State,
          ZipCode = a.Address.ZipCode,
          IsPrimary = a.IsPrimary
        })
        .FirstOrDefault() ?? new AddressDto()
    });

    var combinedResults = mappedResidential.Concat(mappedBusiness)
      .OrderBy(c => c.CreatedAt)
      .ToList();

    var totalCount = combinedResults.Count;
    var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

    var pagedResults = combinedResults
      .Skip((page - 1) * pageSize)
      .Take(pageSize)
      .ToList();

    return Ok(new PaginatedResponse<ClientSearchResultDto>
    {
      Page = page,
      PageSize = pageSize,
      TotalCount = totalCount,
      TotalPages = totalPages,
      Data = pagedResults
    });    
  }

  [HttpGet("search")]
  public async Task<IActionResult> SearchClients(
    [FromQuery] string? firstName,
    [FromQuery] string? lastName,
    [FromQuery] string? email,
    [FromQuery] string? phone,
    [FromQuery] string? businessName,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 25)
  {
    var residentialQuery = _context.ResidentialClients
      .Include(rc => rc.Person)
      .Include(rc => rc.Client)
        .ThenInclude(c => c.Addresses)
          .ThenInclude(ca => ca.Address)
      .AsQueryable();

    if (!string.IsNullOrWhiteSpace(firstName))
      residentialQuery = residentialQuery.Where(rc => rc.Person.FirstName.ToLower().Contains(firstName.ToLower()));
    if (!string.IsNullOrWhiteSpace(lastName))
      residentialQuery = residentialQuery.Where(rc => rc.Person.LastName.ToLower().Contains(lastName.ToLower()));
    if (!string.IsNullOrWhiteSpace(email))
      residentialQuery = residentialQuery.Where(rc => rc.Person.Email.ToLower().Contains(email.ToLower()));
    if (!string.IsNullOrWhiteSpace(phone))
      residentialQuery = residentialQuery.Where(rc => rc.Person.PhoneNumber.ToLower().Contains(phone.ToLower()));

    var residentialResults = await residentialQuery.ToListAsync();

    var mappedResidential = residentialResults.Select(rc => new ClientSearchResultDto
    {
      Uid = rc.Client.Uid,
      Type = ClientType.Residential,
      FirstName = rc.Person.FirstName,
      LastName = rc.Person.LastName,
      Email = rc.Person.Email,
      PhoneNumber = rc.Person.PhoneNumber,
      Notes = rc.Client.Notes,
      CreatedAt = rc.Client.CreatedAt,
      BillingAddress = rc.Client.Addresses!
        .Where(a => a.Type == AddressType.Billing && a.IsPrimary)
        .Select(a => new AddressDto
        {
          Street = a.Address.Street,
          Unit = a.Address.Unit,
          City = a.Address.City,
          State = a.Address.State,
          ZipCode = a.Address.ZipCode,
          IsPrimary = a.IsPrimary
        })
        .FirstOrDefault() ?? new AddressDto()
    });

    var businessQuery = _context.BusinessClients
      .Include(bc => bc.Contacts)
        .ThenInclude(c => c.Person)
      .Include(bc => bc.Client)
        .ThenInclude(c => c.Addresses)
          .ThenInclude(ca => ca.Address)
      .AsQueryable();

    if (!string.IsNullOrWhiteSpace(firstName))
      businessQuery = businessQuery.Where(bc => bc.Contacts.Any(c => c.Person.FirstName.ToLower().Contains(firstName.ToLower())));
    if (!string.IsNullOrWhiteSpace(lastName))
      businessQuery = businessQuery.Where(bc => bc.Contacts.Any(c => c.Person.LastName.ToLower().Contains(lastName.ToLower())));
    if (!string.IsNullOrWhiteSpace(email))
      businessQuery = businessQuery.Where(bc => bc.Contacts.Any(c => c.Person.Email.ToLower().Contains(email.ToLower())));
    if (!string.IsNullOrWhiteSpace(phone))
      businessQuery = businessQuery.Where(bc => bc.Contacts.Any(c => c.Person.PhoneNumber.ToLower().Contains(phone.ToLower())));
    if (!string.IsNullOrWhiteSpace(businessName))
      businessQuery = businessQuery.Where(bc => bc.BusinessName.ToLower().Contains(businessName.ToLower()));

    var businessResults = await businessQuery.ToListAsync();

    var mappedBusiness = businessResults.Select(bc => new ClientSearchResultDto
    {
      Uid = bc.Client.Uid,
      Type = ClientType.Business,
      BusinessName = bc.BusinessName,
      FirstName = bc.Contacts.Where(c => c.IsPrimary).Select(c => c.Person.FirstName).FirstOrDefault(),
      LastName = bc.Contacts.Where(c => c.IsPrimary).Select(c => c.Person.LastName).FirstOrDefault(),
      Email = bc.Contacts.Where(c => c.IsPrimary).Select(c => c.Person.Email).FirstOrDefault(),
      PhoneNumber = bc.Contacts.Where(c => c.IsPrimary).Select(c => c.Person.PhoneNumber).FirstOrDefault(),
      Notes = bc.Client.Notes,
      CreatedAt = bc.Client.CreatedAt,
      BillingAddress = bc.Client.Addresses!
        .Where(a => a.Type == AddressType.Billing && a.IsPrimary)
        .Select(a => new AddressDto
        {
          Street = a.Address.Street,
          Unit = a.Address.Unit,
          City = a.Address.City,
          State = a.Address.State,
          ZipCode = a.Address.ZipCode,
          IsPrimary = a.IsPrimary
        })
        .FirstOrDefault() ?? new AddressDto()
    });

    var combinedResults = mappedResidential.Concat(mappedBusiness)
      .OrderBy(c => c.CreatedAt)
      .ToList();

    var totalCount = combinedResults.Count;
    var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

    var pagedResults = combinedResults
      .Skip((page - 1) * pageSize)
      .Take(pageSize)
      .ToList();

    return Ok(new PaginatedResponse<ClientSearchResultDto>
    {
      Page = page,
      PageSize = pageSize,
      TotalCount = totalCount,
      TotalPages = totalPages,
      Data = pagedResults
    });
  }

  [HttpGet("{uid}")]
  public async Task<IActionResult> GetClient(Guid uid)
  {
    var client = await _context.Clients
      .Include(c => c.ResidentialClient!)
        .ThenInclude(rc => rc.Person)
      .Include(c => c.BusinessClient!)
        .ThenInclude(bc => bc.Contacts)
          .ThenInclude(c => c.Person)
      .Include(c => c.Addresses)
        .ThenInclude(ca => ca.Address)
      .FirstOrDefaultAsync(c => c.Uid == uid);

    if (client == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Client not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };
    }

    if (client.Type == ClientType.Residential && client.ResidentialClient != null)
    {
      var rc = client.ResidentialClient;
      return Ok(new ClientResponseDto
      {
        Uid = client.Uid,
        Notes = client.Notes,
        CreatedAt = client.CreatedAt,
        Type = client.Type,
        FirstName = rc.Person.FirstName,
        LastName = rc.Person.LastName,
        Email = rc.Person.Email,
        PhoneNumber = rc.Person.PhoneNumber,
        BillingAddresses = client.Addresses
          .Where(a => a.Type == AddressType.Billing)
          .OrderByDescending(a => a.IsPrimary)
          .Select(a => new AddressDto
          {
            Street = a.Address.Street,
            Unit = a.Address.Unit,
            City = a.Address.City,
            State = a.Address.State,
            ZipCode = a.Address.ZipCode,
            IsPrimary = a.IsPrimary
          }).ToList(),
        DeliveryAddresses = client.Addresses
          .Where(a => a.Type == AddressType.Delivery)
          .OrderByDescending(a => a.IsPrimary)
          .Select(a => new AddressDto
          {
            Street = a.Address.Street,
            Unit = a.Address.Unit,
            City = a.Address.City,
            State = a.Address.State,
            ZipCode = a.Address.ZipCode,
            IsPrimary = a.IsPrimary
          }).ToList()
      });
    }

    if (client.Type == ClientType.Business && client.BusinessClient != null)
    {
      var bc = client.BusinessClient;
      return Ok(new ClientResponseDto
      {
        Uid = client.Uid,
        Notes = client.Notes,
        CreatedAt = client.CreatedAt,
        Type = client.Type,
        BusinessName = bc.BusinessName,
        IsTaxExempt = bc.IsTaxExempt,
        Contacts = bc.Contacts.Select(contact => new ContactDto
        {
          FirstName = contact.Person.FirstName,
          LastName = contact.Person.LastName,
          Email = contact.Person.Email,
          PhoneNumber = contact.Person.PhoneNumber,
          Role = contact.Role,
          IsPrimary = contact.IsPrimary
        }).ToList(),
        BillingAddresses = client.Addresses
          .Where(a => a.Type == AddressType.Billing)
          .OrderByDescending(a => a.IsPrimary)
          .Select(a => new AddressDto
          {
            Street = a.Address.Street,
            Unit = a.Address.Unit,
            City = a.Address.City,
            State = a.Address.State,
            ZipCode = a.Address.ZipCode,
            IsPrimary = a.IsPrimary
          }).ToList(),
        DeliveryAddresses = client.Addresses
          .Where(a => a.Type == AddressType.Delivery)
          .OrderByDescending(a => a.IsPrimary)
          .Select(a => new AddressDto
          {
            Street = a.Address.Street,
            Unit = a.Address.Unit,
            City = a.Address.City,
            State = a.Address.State,
            ZipCode = a.Address.ZipCode,
            IsPrimary = a.IsPrimary
          }).ToList()
      });
    }

    return new ObjectResult(new ProblemDetails
    {
      Title = "Not Found",
      Detail = "Client not found.",
      Status = StatusCodes.Status404NotFound
    })
    {
      StatusCode = StatusCodes.Status404NotFound
    };
  }

  [HttpPost("create-residential")]
  public async Task<IActionResult> CreateResidentialClient(ResidentialClientCreateDto request)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    var address = new Address
    {
      Street = request.Address.Street,
      Unit = request.Address.Unit,
      City = request.Address.City,
      State = request.Address.State,
      ZipCode = request.Address.ZipCode
    };

    var client = new Client
    {
      Type = ClientType.Residential,
      Notes = request.Notes,
      CreatedAt = DateTime.UtcNow,
      Addresses = new List<ClientAddress>
      {
        new ClientAddress
        {
          Address = address,
          Type = AddressType.Billing,
          IsPrimary = true,
        },
        new ClientAddress
        {
          Address = address,
          Type = AddressType.Delivery,
          IsPrimary = true,
        }
      }
    };

    var residentialClient = new ResidentialClient
    {
      Client = client,
      Person = new Person
      {
        FirstName = request.FirstName,
        LastName = request.LastName,
        PhoneNumber = request.PhoneNumber,
        Email = request.Email
      }
    };

    _context.ResidentialClients.Add(residentialClient);
    await _context.SaveChangesAsync();

    return Ok(new ResidentialClientResponseDto
    {
      Uid = client.Uid,
      FirstName = residentialClient.Person.FirstName,
      LastName = residentialClient.Person.LastName,
      Email = residentialClient.Person.Email,
      PhoneNumber = residentialClient.Person.PhoneNumber,
      Notes = client.Notes,
      CreatedAt = client.CreatedAt,
      BillingAddress = residentialClient
        .Client.Addresses
        .Where(ca => ca.Type == AddressType.Billing && ca.IsPrimary)
        .Select(ca => new AddressDto
        {
          Street = ca.Address.Street,
          Unit = ca.Address.Unit,
          City = ca.Address.City,
          State = ca.Address.State,
          ZipCode = ca.Address.ZipCode
        })
        .FirstOrDefault(),
      DeliveryAddress = residentialClient
        .Client.Addresses
        .Where(ca => ca.Type == AddressType.Delivery && ca.IsPrimary)
        .Select(ca => new AddressDto
        {
          Street = ca.Address.Street,
          Unit = ca.Address.Unit,
          City = ca.Address.City,
          State = ca.Address.State,
          ZipCode = ca.Address.ZipCode
        })
        .FirstOrDefault()
    });
  }

  [HttpDelete("{uid}")]
  public async Task<IActionResult> Delete(Guid uid)
  {
    var role = User.FindFirst(ClaimTypes.Role)?.Value;
    if (role != "Admin")
      return new ObjectResult(new ProblemDetails
      {
        Title = "Forbidden",
        Detail = "You do not have permission to perform this action.",
        Status = StatusCodes.Status403Forbidden
      })
      {
        StatusCode = StatusCodes.Status403Forbidden
      };

    var client = await _context.Clients.FirstOrDefaultAsync(c => c.Uid == uid);

    if (client == null)
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "User not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };

    _context.Clients.Remove(client);
    await _context.SaveChangesAsync();

    return NoContent();
  }
}