using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Exceptions;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Plando.Infrastructure.Services;

public class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _iConfiguration;

    public JwtTokenService(IConfiguration iConfiguration)
    {
        _iConfiguration = iConfiguration;
    }

    public string GenerateToken(User user)
    {
        var secretKey = _iConfiguration["JwtSettings:SecretKey"];
        var issuer = _iConfiguration["JwtSettings:Issuer"];
        var audience = _iConfiguration["JwtSettings:Audience"];
        var expirationInMinutes = _iConfiguration["JwtSettings:ExpirationInMinutes"];

        if (secretKey is null || string.IsNullOrWhiteSpace(secretKey))
            throw new DomainException("Secret key is null or empty!");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var jwtSecurityToken = 
            new JwtSecurityToken(
                issuer, 
                audience, 
                claims, 
                expires: DateTime.UtcNow.AddMinutes(double.Parse(expirationInMinutes!)),
                signingCredentials: credentials
            );

        return new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
    }
}
