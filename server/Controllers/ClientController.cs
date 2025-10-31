using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Address;
using server.DTOs.Client;
using server.DTOs.ClientProfile;
using server.Helpers;
using System.Security.Claims;
using System.Xml;


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

  [HttpGet]
  public async Task<IActionResult> GetClients([FromQuery] int page = 1, [FromQuery] int pageSize = 25, [FromQuery] ClientType? type = null)
  {
    var query = _context.Clients
    .Include(c => c.ClientAddresses)
    .AsQueryable();

      if (type.HasValue)
      {
          query = query.Where(c => c.Type == type.Value);
      }

      var totalCount = await query.CountAsync();

      var results = await query
          .OrderBy(c => c.ClientAddresses
              .Where(p => p.IsPrimary)
              .Select(p => p.LastName)
              .FirstOrDefault())
          .ThenBy(c => c.ClientAddresses
              .Where(p => p.IsPrimary)
              .Select(p => p.FirstName)
              .FirstOrDefault())
          .Skip((page - 1) * pageSize)
          .Take(pageSize)
          .Select(c => new ClientSearchResultDto
          {
              Uid = c.Uid,
              Type = c.Type,
              FirstName = c.FirstName,
              LastName = c.LastName,
              Email = c.Email,
              PhoneNumber = c.PhoneNumber,
              Notes = c.Notes,
              CreatedAt = c.CreatedAt,
              BillingAddress = c.ClientAddresses
                  .Where(p => p.Type == ClientAddressType.Billing && p.IsPrimary)
                  .Select(p => new AddressDto
                  {
                      AddressLine1 = p.AddressLine1,
                      AddressLine2 = p.AddressLine2,
                      City = p.City,
                      State = p.State,
                      ZipCode = p.ZipCode,
                      IsPrimary = p.IsPrimary
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
          return Ok(new PaginatedResponse<ClientResponseDto>
          {
              Page = page,
              PageSize = pageSize,
              TotalCount = 0,
              TotalPages = 0,
              Data = new List<ClientResponseDto>()
          });
      }

      var clientsQuery = _context.Clients
          .Include(c => c.ClientAddresses)
          .Where(c => c.ClientAddresses.Any(p =>
              ((p.FirstName ?? "") + " " + (p.LastName ?? "")).ToLower().Contains(query) ||
              (p.FirstName ?? "").ToLower().Contains(query) ||
              (p.LastName ?? "").ToLower().Contains(query) ||
              (p.Email ?? "").ToLower().Contains(query) ||
              (p.PhoneNumber ?? "").ToLower().Contains(query)
          ));

      var totalCount = await clientsQuery.CountAsync();
      var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

      var clients = await clientsQuery
          .OrderBy(c => c.LastName)
          .ThenBy(c => c.FirstName)
          .Skip((page - 1) * pageSize)
          .Take(pageSize)
          .ToListAsync();

      var results = clients.Select(c =>
      {
          var primaryBilling = c.ClientAddresses
              .Where(a => a.Type == ClientAddressType.Billing)
              .OrderByDescending(a => a.IsPrimary)
              .FirstOrDefault();

        var primaryDelivery = c.ClientAddresses
            .Where(a => a.Type == ClientAddressType.Delivery)
            .OrderByDescending(a => a.IsPrimary)
            .FirstOrDefault();

          return new ClientResponseDto
          {
              Uid = c.Uid,
              Notes = c.Notes,
              CreatedAt = c.CreatedAt,
              Type = c.Type,
              FirstName = c.FirstName,
              LastName = c.LastName,
              Email = c.Email,
              PhoneNumber = c.PhoneNumber,
              BillingAddresses = c.ClientAddresses
                  .Where(a => a.Type == ClientAddressType.Billing)
                  .OrderByDescending(a => a.IsPrimary)
                  .Select(a => new ClientProfileDto
                  {
                      Uid = a.Uid,
                      FirstName = primaryBilling?.FirstName ?? "",
                      LastName = primaryBilling?.LastName ?? "",
                      PhoneNumber = primaryBilling?.PhoneNumber ?? "",
                      Email = primaryBilling?.Email ?? "",
                      AddressLine1 = a.AddressLine1,
                      AddressLine2 = a.AddressLine2,
                      City = a.City,
                      State = a.State,
                      ZipCode = a.ZipCode,
                      IsPrimary = a.IsPrimary
                  })
                  .ToList(),
              DeliveryAddresses = c.ClientAddresses
                  .Where(a => a.Type == ClientAddressType.Delivery)
                  .OrderByDescending(a => a.IsPrimary)
                  .Select(a => new ClientProfileDto
                  {
                      Uid = a.Uid,
                      FirstName = primaryDelivery?.FirstName ?? "",
                      LastName = primaryDelivery?.LastName ?? "",
                      PhoneNumber = primaryDelivery?.PhoneNumber ?? "",
                      Email = primaryDelivery?.Email ?? "",
                      AddressLine1 = a.AddressLine1,
                      AddressLine2 = a.AddressLine2,
                      City = a.City,
                      State = a.State,
                      ZipCode = a.ZipCode,
                      IsPrimary = a.IsPrimary
                  })
                  .ToList()
          };
      }).ToList();

      return Ok(new PaginatedResponse<ClientResponseDto>
      {
          Page = page,
          PageSize = pageSize,
          TotalCount = totalCount,
          TotalPages = totalPages,
          Data = results
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
      var query = _context.Clients
          .Include(c => c.ClientAddresses)
          .AsQueryable();

      if (!string.IsNullOrWhiteSpace(businessName))
          query = query.Where(c => c.Type == ClientType.Business && c.BusinessName!.ToLower().Contains(businessName.ToLower()));

      if (!string.IsNullOrWhiteSpace(firstName))
          query = query.Where(c => c.ClientAddresses.Any(p => p.FirstName.ToLower().Contains(firstName.ToLower())));

      if (!string.IsNullOrWhiteSpace(lastName))
          query = query.Where(c => c.ClientAddresses.Any(p => p.LastName.ToLower().Contains(lastName.ToLower())));

      if (!string.IsNullOrWhiteSpace(email))
          query = query.Where(c => c.ClientAddresses.Any(p => p.Email.ToLower().Contains(email.ToLower())));

      if (!string.IsNullOrWhiteSpace(phone))
          query = query.Where(c => c.ClientAddresses.Any(p => p.PhoneNumber.ToLower().Contains(phone.ToLower())));

      var totalCount = await query.CountAsync();
      var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

      var results = await query
          .OrderBy(c => c.ClientAddresses
              .Where(p => p.IsPrimary)
              .Select(p => p.LastName)
              .FirstOrDefault())
          .ThenBy(c => c.ClientAddresses
              .Where(p => p.IsPrimary)
              .Select(p => p.FirstName)
              .FirstOrDefault())
          .Skip((page - 1) * pageSize)
          .Take(pageSize)
          .Select(c => new ClientSearchResultDto
          {
              Uid = c.Uid,
              Type = c.Type,
              BusinessName = c.BusinessName,
              FirstName = c.FirstName,
              LastName = c.LastName,
              Email = c.Email,
              PhoneNumber = c.PhoneNumber,
              Notes = c.Notes,
              CreatedAt = c.CreatedAt,
              BillingAddress = c.ClientAddresses
                  .Where(p => p.Type == ClientAddressType.Billing && p.IsPrimary)
                  .Select(p => new AddressDto
                  {
                      AddressLine1 = p.AddressLine1,
                      AddressLine2 = p.AddressLine2,
                      City = p.City,
                      State = p.State,
                      ZipCode = p.ZipCode,
                      IsPrimary = p.IsPrimary
                  })
                  .FirstOrDefault() ?? new AddressDto()
          })
          .ToListAsync();

      return Ok(new PaginatedResponse<ClientSearchResultDto>
      {
          Page = page,
          PageSize = pageSize,
          TotalCount = totalCount,
          TotalPages = totalPages,
          Data = results
      });
  }


  [HttpGet("{uid}")]
  public async Task<IActionResult> GetClient(Guid uid)
  {
    var client = await _context.Clients
      .Include(c => c.ClientAddresses)
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

    var primaryBilling = client.ClientAddresses
        .FirstOrDefault(a => a.Type == ClientAddressType.Billing && a.IsPrimary)
        ?? client.ClientAddresses.FirstOrDefault(a => a.Type == ClientAddressType.Billing);

    var primaryDelivery = client.ClientAddresses
        .FirstOrDefault(a => a.Type == ClientAddressType.Delivery && a.IsPrimary)
        ?? client.ClientAddresses.FirstOrDefault(a => a.Type == ClientAddressType.Delivery);


    if (primaryBilling == null || primaryDelivery == null)
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Bad Request",
        Detail = "Client has no primary contact.",
        Status = StatusCodes.Status400BadRequest
      })
      {
        StatusCode = StatusCodes.Status400BadRequest
      };
    }

    var result = client;
    return Ok(new ClientResponseDto
    {
      Uid = client.Uid,
      Notes = client.Notes,
      CreatedAt = client.CreatedAt,
      Type = client.Type,
      FirstName = client.FirstName,
      LastName = client.LastName,
      Email = client.Email,
      PhoneNumber = client.PhoneNumber,
      BillingAddresses = client.ClientAddresses
        .Where(p => p.Type == ClientAddressType.Billing)
        .OrderByDescending(p => p.IsPrimary)
        .Select(p => new ClientProfileDto
        {
          Uid = p.Uid,
          FirstName = primaryBilling.FirstName,
          LastName = primaryBilling.LastName,
          PhoneNumber = primaryBilling.PhoneNumber,
          Email = primaryBilling.Email,
          AddressLine1 = p.AddressLine1,
          AddressLine2 = p.AddressLine2,
          City = p.City,
          State = p.State,
          ZipCode = p.ZipCode,
          IsPrimary = p.IsPrimary
        }).ToList(),
      DeliveryAddresses = client.ClientAddresses
        .Where(a => a.Type == ClientAddressType.Delivery)
        .OrderByDescending(a => a.IsPrimary)
        .Select(a => new ClientProfileDto
        {
          Uid = a.Uid,
          FirstName = primaryDelivery.FirstName,
          LastName = primaryDelivery.LastName,
          PhoneNumber = primaryDelivery.PhoneNumber,
          Email = primaryDelivery.Email,
          AddressLine1 = a.AddressLine1,
          AddressLine2 = a.AddressLine2,
          City = a.City,
          State = a.State,
          ZipCode = a.ZipCode,
          IsPrimary = a.IsPrimary
        }).ToList()
    });
  }

  [HttpPost]
  public async Task<IActionResult> CreateClient(CreateClientDto request)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    var billingAddress = new ClientAddress
    {
      AddressLine1 = request.Address.AddressLine1,
      AddressLine2 = request.Address.AddressLine2,
      City = request.Address.City,
      State = request.Address.State,
      ZipCode = request.Address.ZipCode,
      NormalizedCity = CityNormalizer.NormalizeCity(request.Address.City),
      NormalizedStreet = AddressNormalizer.Normalize(request.Address.AddressLine1),
      FirstName = request.FirstName,
      LastName = request.LastName,
      Email = request.Email,
      PhoneNumber = request.PhoneNumber,
      IsPrimary = true,
      Type = ClientAddressType.Billing,
    };

    var deliveryAddress = new ClientAddress
    {
      AddressLine1 = request.Address.AddressLine1,
      AddressLine2 = request.Address.AddressLine2,
      City = request.Address.City,
      State = request.Address.State,
      ZipCode = request.Address.ZipCode,
      NormalizedCity = CityNormalizer.NormalizeCity(request.Address.City),
      NormalizedStreet = AddressNormalizer.Normalize(request.Address.AddressLine1),
      FirstName = request.FirstName,
      LastName = request.LastName,
      Email = request.Email,
      PhoneNumber = request.PhoneNumber,
      IsPrimary = true,
      Type = ClientAddressType.Delivery,
    };

    var client = new Client
    {
      Type = request.Type,
      BusinessName = request.BusinessName,
      FirstName = request.FirstName,
      LastName = request.LastName,
      PhoneNumber = request.PhoneNumber,
      Email = request.Email,
      Notes = request.Notes,
      CreatedAt = DateTime.UtcNow,
      ClientAddresses = new List<ClientAddress>
      {
       billingAddress, deliveryAddress
      }
    };

    _context.Clients.Add(client);
    await _context.SaveChangesAsync();

    return Ok(new CreateClientResponseDto
    {
      Uid = client.Uid,
      FirstName = client.FirstName,
      LastName = client.LastName,
      Email = client.Email,
      PhoneNumber = client.PhoneNumber,
      Notes = client.Notes,
      CreatedAt = client.CreatedAt,
      BillingAddress = client
        .ClientAddresses
        .Where(p => p.Type == ClientAddressType.Billing && p.IsPrimary)
        .Select(p => new AddressDto
        {
          AddressLine1 = p.AddressLine1,
          AddressLine2 = p.AddressLine2,
          City = p.City,
          State = p.State,
          ZipCode = p.ZipCode
        })
        .FirstOrDefault(),
      DeliveryAddress = client
        .ClientAddresses
        .Where(p => p.Type == ClientAddressType.Delivery && p.IsPrimary)
        .Select(p => new AddressDto
        {
          AddressLine1 = p.AddressLine1,
          AddressLine2 = p.AddressLine2,
          City = p.City,
          State = p.State,
          ZipCode = p.ZipCode
        })
        .FirstOrDefault()
    });
  }

  [HttpPatch("{uid}")]
  public async Task<IActionResult> Update(Guid uid, [FromBody] UpdateClientDto body)
  {
      var client = await _context.Clients
          .Include(c => c.ClientAddresses)
          .FirstOrDefaultAsync(c => c.Uid == uid);

      if (client == null)
          return NotFound(new { message = "Client not found." });

      client.Notes = body.Notes;

      await _context.SaveChangesAsync();

      var primaryContact = client.ClientAddresses
          .FirstOrDefault(c => c.IsPrimary)
          ?? client.ClientAddresses.FirstOrDefault();

      return Ok(new ClientResponseDto
      {
          Uid = client.Uid,
          CreatedAt = client.CreatedAt,
          Type = client.Type,
          Notes = client.Notes,

          FirstName = client.FirstName,
          LastName = client.LastName,
          Email = client.Email,
          PhoneNumber = client.PhoneNumber,

          BillingAddresses = client.ClientAddresses
              .Where(p => p.Type == ClientAddressType.Billing)
              .OrderByDescending(p => p.IsPrimary)
              .Select(p => new ClientProfileDto
              {
                  Uid = p.Uid,
                  FirstName = p.FirstName,
                  LastName = p.LastName,
                  PhoneNumber = p.PhoneNumber,
                  AddressLine1 = p.AddressLine1,
                  AddressLine2 = p.AddressLine2,
                  City = p.City,
                  State = p.State,
                  ZipCode = p.ZipCode,
                  IsPrimary = p.IsPrimary
              }).ToList(),

          DeliveryAddresses = client.ClientAddresses
              .Where(p => p.Type == ClientAddressType.Delivery)
              .OrderByDescending(p => p.IsPrimary)
              .Select(p => new ClientProfileDto
              {
                  Uid = p.Uid,
                  FirstName = p.FirstName,
                  LastName = p.LastName,
                  PhoneNumber = p.PhoneNumber,
                  AddressLine1 = p.AddressLine1,
                  AddressLine2 = p.AddressLine2,
                  City = p.City,
                  State = p.State,
                  ZipCode = p.ZipCode,
                  IsPrimary = p.IsPrimary
              }).ToList()
      });
  }

  [HttpPost("{uid}/client-addresses")]
  public async Task<IActionResult> AddAddress(Guid uid, [FromBody] ClientAddressCreateDto request)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

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

    if (!Enum.TryParse<ClientAddressType>(request.Type, ignoreCase: true, out var parsedType))
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Invalid Address Type",
        Detail = $"'{request.Type}' is not a valid address type. Use 'Billing' or 'Delivery'.",
        Status = StatusCodes.Status400BadRequest
      })
      {
        StatusCode = StatusCodes.Status400BadRequest
      };
    }

    if (request.IsPrimary)
    {
      var existingPrimary = await _context.ClientAddresses
        .FirstOrDefaultAsync(e =>
          e.ClientId == client.Id &&
          e.Type == parsedType &&
          e.IsPrimary);

      if (existingPrimary != null)
      {
        existingPrimary.IsPrimary = false;
      }
    }

    var entry = new ClientAddress
    {
      Client = client,
      Type = parsedType,
      Label = request.Label,
      IsPrimary = request.IsPrimary,
      FirstName = request.FirstName,
      LastName = request.LastName,
      Email = request.Email ?? "",
      PhoneNumber = request.PhoneNumber,
      AddressLine1 = request.AddressLine1,
      AddressLine2 = request.AddressLine2,
      City = request.City,
      State = request.State,
      ZipCode = request.ZipCode,
    };

    _context.ClientAddresses.Add(entry);

    await _context.SaveChangesAsync();

    var response = new ClientAddressDto
    {
      Uid = entry.Uid,
      FirstName = request.FirstName,
      LastName = request.LastName,
      PhoneNumber = request.PhoneNumber,
      Email = request.Email ?? "",
      Role = request.Role,
      AddressLine1 = request.AddressLine1,
      AddressLine2 = request.AddressLine2,
      City = request.City,
      State = request.State,
      ZipCode = request.ZipCode,
      IsPrimary = request.IsPrimary,
      Label = request.Label,
      Type = parsedType,
    };
    return Ok(response);
  }

  [HttpPatch("client-addresses/{addressUid}/{type}")]
  public async Task<IActionResult> ChangePrimaryAddress(Guid addressUid, string type)
  {
    var clientAddress = await _context.ClientAddresses.FirstOrDefaultAsync(a => a.Uid == addressUid);

    if (clientAddress == null)
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Client address not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };

    if (clientAddress.IsPrimary == true)
      return new ObjectResult(new ProblemDetails
      {
        Title = "Bad Request",
        Detail = "Client address is already set to primary.",
        Status = StatusCodes.Status400BadRequest
      })
      {
        StatusCode = StatusCodes.Status400BadRequest
      };

    if (!Enum.TryParse<ClientAddressType>(type, ignoreCase: true, out var parsedType))
    {
      return new ObjectResult(new ProblemDetails
      {
        Title = "Invalid Address Type",
        Detail = $"'{type}' is not a valid address type. Use 'Billing' or 'Delivery'.",
        Status = StatusCodes.Status400BadRequest
      })
      {
        StatusCode = StatusCodes.Status400BadRequest
      };
    }

    var primaryAddress = await _context.ClientAddresses
      .Where(a => a.ClientId == clientAddress.ClientId && a.IsPrimary && a.Type == parsedType)
      .FirstOrDefaultAsync();

    if (primaryAddress != null)

      primaryAddress.IsPrimary = false;
    clientAddress.IsPrimary = true;
    await _context.SaveChangesAsync();
    return NoContent();
  }

  [HttpPatch("client-addresses/{addressUid}")]
  public async Task<IActionResult> UpdateAddress(Guid addressUid, [FromBody] ClientAddressCreateDto request)
  {
      var entry = await _context.ClientAddresses
          .FirstOrDefaultAsync(e => e.Uid == addressUid);

      if (entry == null)
          return NotFound(new ProblemDetails
          {
              Title = "Not Found",
              Detail = "Address Book Entry not found."
          });

      if (!Enum.TryParse<ClientAddressType>(request.Type, true, out var parsedType))
          return BadRequest(new ProblemDetails
          {
              Title = "Invalid Address Type",
              Detail = $"'{request.Type}' is not valid. Use 'Billing' or 'Delivery'."
          });

      entry.FirstName = request.FirstName;
      entry.LastName = request.LastName;
      entry.PhoneNumber = request.PhoneNumber;
      entry.Email = request.Email ?? "";
      entry.Role = request.Role;

      entry.AddressLine1 = request.AddressLine1;
      entry.AddressLine2 = request.AddressLine2;
      entry.City = request.City;
      entry.State = request.State;
      entry.ZipCode = request.ZipCode;

      entry.Label = request.Label;
      entry.Type = parsedType;

      if (request.IsPrimary)
      {
          var existingPrimary = await _context.ClientAddresses
              .FirstOrDefaultAsync(e =>
                  e.ClientId == entry.ClientId &&
                  e.Type == parsedType &&
                  e.IsPrimary &&
                  e.Uid != entry.Uid);

          if (existingPrimary != null)
              existingPrimary.IsPrimary = false;

          entry.IsPrimary = true;
      }
      else
      {
          entry.IsPrimary = false;
      }

      await _context.SaveChangesAsync();

      return Ok(new ClientAddressDto
      {
          Uid = entry.Uid,
          FirstName = entry.FirstName,
          LastName = entry.LastName,
          PhoneNumber = entry.PhoneNumber,
          Email = entry.Email,
          AddressLine1 = entry.AddressLine1,
          AddressLine2 = entry.AddressLine2,
          City = entry.City,
          State = entry.State,
          ZipCode = entry.ZipCode,
          IsPrimary = entry.IsPrimary,
          Label = entry.Label,
          Type = parsedType,
      });
  }
  
  [HttpDelete("address-book-entries/{addressUid}")]
  public async Task<IActionResult> DeleteAddressEntry(Guid addressUid)
  {
    var addressBookEntry = await _context.ClientAddresses.FirstOrDefaultAsync(a => a.Uid == addressUid);

    if (addressBookEntry == null)
      return new ObjectResult(new ProblemDetails
      {
        Title = "Not Found",
        Detail = "Address Book Entry not found.",
        Status = StatusCodes.Status404NotFound
      })
      {
        StatusCode = StatusCodes.Status404NotFound
      };
    
    if (addressBookEntry.IsPrimary == true)
      return new ObjectResult(new ProblemDetails
      {
        Title = "Bad Request",
        Detail = "Cannot delete a primary address.",
        Status = StatusCodes.Status400BadRequest
      })
      {
        StatusCode = StatusCodes.Status400BadRequest
      };

    _context.ClientAddresses.Remove(addressBookEntry);
    await _context.SaveChangesAsync();

    return NoContent();
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
        Detail = "Client not found.",
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