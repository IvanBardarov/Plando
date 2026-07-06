using Plando.Domain.Entities;

namespace Plando.Application.Interfaces;

public interface IJwtTokenService
{
    string GenerateToken(User user);
}