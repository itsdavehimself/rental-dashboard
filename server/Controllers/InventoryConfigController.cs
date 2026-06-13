using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs.Inventory;
using server.Models.Inventory;
using System.Security.Claims;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")] 
public class InventoryConfigController : ControllerBase
{
    private readonly AppDbContext _context;

    public InventoryConfigController(AppDbContext context)
    {
        _context = context;
    }


    private bool IsAdmin()
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        return role == "Admin";
    }

    private IActionResult ForbiddenResponse() => 
        StatusCode(StatusCodes.Status403Forbidden, new ProblemDetails { Title = "Forbidden", Detail = "Admin access required." });
    
    [HttpPost("type")]
    public async Task<IActionResult> CreateType([FromBody] CreateTypeDto request)
    {
        if (!IsAdmin()) return ForbiddenResponse();

        var type = new InventoryType
        {
            Name = request.Label.Replace(" ", ""),
            Label = request.Label,
            SkuCode = request.SkuCode.ToUpper()
        };

        _context.InventoryTypes.Add(type);
        await _context.SaveChangesAsync();
        return Ok(type);
    }

    [HttpPut("type/{id}")]
    public async Task<IActionResult> UpdateType(int id, [FromBody] UpdateConfigItemDto request)
    {
        if (!IsAdmin()) return ForbiddenResponse();

        var type = await _context.InventoryTypes.FindAsync(id);
        if (type == null) return NotFound();

        type.Label = request.Label;
        type.Name = request.Label.Replace(" ", "");
        if (request.SkuCode != null) type.SkuCode = request.SkuCode.ToUpper();

        await _context.SaveChangesAsync();
        return Ok(type);
    }


    [HttpPost("subtype")]
    public async Task<IActionResult> CreateSubType([FromBody] CreateSubTypeDto request)
    {
        if (!IsAdmin()) return ForbiddenResponse();

        var typeExists = await _context.InventoryTypes.AnyAsync(t => t.Id == request.InventoryTypeId);
        if (!typeExists) return BadRequest("Parent Type not found.");

        var subType = new InventorySubType
        {
            InventoryTypeId = request.InventoryTypeId,
            Name = request.Label.Replace(" ", ""),
            Label = request.Label,
            SkuCode = request.SkuCode?.ToUpper() ?? "SUB"
        };

        _context.InventorySubTypes.Add(subType);
        await _context.SaveChangesAsync();
        return Ok(subType);
    }

    [HttpPut("subtype/{id}")]
    public async Task<IActionResult> UpdateSubType(int id, [FromBody] UpdateConfigItemDto request)
    {
        if (!IsAdmin()) return ForbiddenResponse();

        var subType = await _context.InventorySubTypes.FindAsync(id);
        if (subType == null) return NotFound();

        subType.Label = request.Label;
        subType.Name = request.Label.Replace(" ", "");
        if (request.SkuCode != null) subType.SkuCode = request.SkuCode.ToUpper();

        await _context.SaveChangesAsync();
        return Ok(subType);
    }


    [HttpPost("material")]
    public async Task<IActionResult> CreateMaterial([FromBody] CreateAttributeDto request)
    {
        if (!IsAdmin()) return ForbiddenResponse();

        var material = new InventoryMaterial
        {
            InventorySubTypeId = request.InventorySubTypeId,
            Name = request.Label.Replace(" ", ""),
            Label = request.Label,
            SkuCode = request.SkuCode?.ToUpper() ?? "MAT"
        };

        _context.InventoryMaterials.Add(material);
        await _context.SaveChangesAsync();
        return Ok(material);
    }


    [HttpPost("color")]
    public async Task<IActionResult> CreateColor([FromBody] CreateAttributeDto request)
    {
        if (!IsAdmin()) return ForbiddenResponse();

        var color = new InventoryColor
        {
            InventorySubTypeId = request.InventorySubTypeId,
            Name = request.Label.Replace(" ", ""),
            Label = request.Label,
            SkuCode = request.SkuCode?.ToUpper() ?? "CLR"
        };

        _context.InventoryColors.Add(color);
        await _context.SaveChangesAsync();
        return Ok(color);
    }


    [HttpPost("theme")]
    public async Task<IActionResult> CreateTheme([FromBody] CreateAttributeDto request)
    {
        if (!IsAdmin()) return ForbiddenResponse();

        var theme = new BounceHouseType
        {
            InventorySubTypeId = request.InventorySubTypeId,
            Name = request.Label.Replace(" ", ""),
            Label = request.Label
        };

        _context.BounceHouseTypes.Add(theme);
        await _context.SaveChangesAsync();
        return Ok(theme);
    }

    [HttpPut("material/{id}")]
    public async Task<IActionResult> UpdateMaterial(int id, [FromBody] UpdateConfigItemDto request)
    {
        if (!IsAdmin()) return ForbiddenResponse();

        var material = await _context.InventoryMaterials.FindAsync(id);
        if (material == null) return NotFound();

        material.Label = request.Label;
        material.Name = request.Label.Replace(" ", "");

        await _context.SaveChangesAsync();
        return Ok(material);
    }

    [HttpPut("color/{id}")]
    public async Task<IActionResult> UpdateColor(int id, [FromBody] UpdateConfigItemDto request)
    {
        if (!IsAdmin()) return ForbiddenResponse();

        var color = await _context.InventoryColors.FindAsync(id);
        if (color == null) return NotFound();

        color.Label = request.Label;
        color.Name = request.Label.Replace(" ", "");

        await _context.SaveChangesAsync();
        return Ok(color);
    }

    [HttpPut("theme/{id}")]
    public async Task<IActionResult> UpdateTheme(int id, [FromBody] UpdateConfigItemDto request)
    {
        if (!IsAdmin()) return ForbiddenResponse();

        var theme = await _context.BounceHouseTypes.FindAsync(id);
        if (theme == null) return NotFound();

        theme.Label = request.Label;
        theme.Name = request.Label.Replace(" ", "");

        await _context.SaveChangesAsync();
        return Ok(theme);
    }
}