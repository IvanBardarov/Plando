using Microsoft.AspNetCore.Identity;
using Plando.Application.Interfaces;
using Plando.Domain.Exceptions;

namespace Plando.Application.Commands.Users;

public class LoginUserCommandHandler
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenService _jwtTokenService;

    public LoginUserCommandHandler(IUserRepository userRepository,
        IJwtTokenService jwtTokenService)
    {
        _userRepository = userRepository;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<string> HandleAsync(LoginUserCommand command)
    {
        var user = await _userRepository.GetByEmailAsync(command.Email);

        if (user is null)
            throw new DomainException("There is not such an user!");

        var passwordHasher = new PasswordHasher<string>();

        var checkHashedPassword = passwordHasher
            .VerifyHashedPassword(user.Email, user.PasswordHash, command.Password);

        if (checkHashedPassword == PasswordVerificationResult.Failed)
            throw new DomainException("Wrong password!");

        // todo: rehash needed - update password hash in database
        // when checkHashedPassword == PasswordVerificationResult.SuccessRehashNeeded

        return _jwtTokenService.GenerateToken(user);
    }
}