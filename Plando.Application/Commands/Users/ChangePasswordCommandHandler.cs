using Microsoft.AspNetCore.Identity;
using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Exceptions;

namespace Plando.Application.Commands.Users;

public class ChangePasswordCommandHandler
{
    private readonly IUserRepository _userRepository;

    public ChangePasswordCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserDto> HandleAsync(ChangePasswordCommand command)
    {
        var user = await _userRepository.GetByIdAsync(command.Id);
        if (user is null)
            throw new DomainException("User was not found!");

        var passwordHasher = new PasswordHasher<string>();
        var oldPasswordResult = passwordHasher.VerifyHashedPassword(user.Email, user.PasswordHash, command.OldPassword);

        if (oldPasswordResult == PasswordVerificationResult.Failed)
            throw new DomainException("Wrong old password! Try again!");

        var newPassword = passwordHasher.HashPassword(user.Email, command.NewPassword);

        user.Update(newPassword);

        await _userRepository.SaveChangesAsync();

        return UserDto.FromEntity(user);
    }
}