using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]

public class AuthController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly IConfiguration _config;

  public AuthController(AppDbContext context, IConfiguration config)
  {
    _context = context;
    _config = config;
  }

  [HttpPost("register")]
  public async Task<IActionResult> Register(CreateUserDto request)
  {
    if (await _context.Users.AnyAsync(u => u.Email == request.Email))
      return BadRequest(new { message = "Email already in use" });

    var hashedPassword = HashPassword(request.Password);

    var role = await _context.Roles.FirstOrDefaultAsync(r => r.Id == request.RoleId);
    if (role == null)
      return BadRequest(new { message = "Invalid role" });

    var user = new User
    {
      FirstName = request.FirstName,
      LastName = request.LastName,
      Email = request.Email,
      PhoneNumber = request.PhoneNumber,
      PasswordHash = hashedPassword,
      RoleId = request.RoleId,
      Role = role,
      CreatedAt = DateTime.UtcNow,
      IsActive = true,
    };

    _context.Users.Add(user);
    await _context.SaveChangesAsync();

    var token = CreateToken(user);

    Response.Cookies.Append("access_token", token, new CookieOptions
    {
      HttpOnly = true,
      Secure = false,
      SameSite = SameSiteMode.Strict,
      Expires = DateTime.UtcNow.AddDays(7)
    });

    return Ok(new { message = "User registered" });
  }

  [HttpPost("login")]
  public async Task<IActionResult> Login(LoginDto request)
  {
    var user = await _context.Users
        .Include(u => u.Role)
        .FirstOrDefaultAsync(u => u.Email == request.Email);
    if (user == null)
      return BadRequest(new { message = "Invalid credentials" });

    var isValid = VerifyPassword(request.Password, user.PasswordHash);

    if (!isValid)
      return BadRequest(new { message = "Invalid credentials" });

    string token = CreateToken(user);

    Response.Cookies.Append("access_token", token, new CookieOptions
    {
      HttpOnly = true,
      Secure = false,
      SameSite = SameSiteMode.Strict,
      Expires = DateTime.UtcNow.AddDays(7)
    });

    return Ok(new { message = "User logged in" });
  }

  [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("access_token");
        return Ok(new { message = "Logged out" });
    }

  [HttpDelete("{email}")]
  public async Task<IActionResult> Delete(string email)
  {
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

    if (user == null)
    {
      return NotFound(new { message = "User not found" });
    }

    _context.Users.Remove(user);
    await _context.SaveChangesAsync();

    return NoContent();
  }
  public static string HashPassword(string password)
  {
    byte[] salt = RandomNumberGenerator.GetBytes(128 / 8);
    string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
        password: password,
        salt: salt,
        prf: KeyDerivationPrf.HMACSHA256,
        iterationCount: 100_000,
        numBytesRequested: 256 / 8));

    return $"{Convert.ToBase64String(salt)}.{hashed}";
  }

  public static bool VerifyPassword(string password, string storedHash)
  {
    var parts = storedHash.Split('.');
    var salt = Convert.FromBase64String(parts[0]);
    var stored = parts[1];

    string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
        password: password,
        salt: salt,
        prf: KeyDerivationPrf.HMACSHA256,
        iterationCount: 100_000,
        numBytesRequested: 256 / 8));

    return hashed == stored;
  }
  
  private string CreateToken(User user)
    {
    var claims = new[]
    {
            new Claim(ClaimTypes.NameIdentifier, user.Uid.ToString()),
            new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.MobilePhone, user.PhoneNumber),
            new Claim(ClaimTypes.Role, user.Role.Name)
        };

      var key = new SymmetricSecurityKey(
          Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
      );

      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

      var token = new JwtSecurityToken(
          issuer: _config["Jwt:Issuer"],
          audience: _config["Jwt:Audience"],
          claims: claims,
          expires: DateTime.UtcNow.AddDays(7),
          signingCredentials: creds
      );

      return new JwtSecurityTokenHandler().WriteToken(token);
    }
  
}