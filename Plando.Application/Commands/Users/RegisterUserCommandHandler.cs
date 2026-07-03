using Microsoft.AspNetCore.Identity;
using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Entities;
using Plando.Domain.Exceptions;

namespace Plando.Application.Commands.Users;

public class RegisterUserCommandHandler
{
    private readonly IUserRepository _userRepository;

    public RegisterUserCommandHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserDto> HandleAsync(RegisterUserCommand command)
    {
        var user = await _userRepository.GetByEmailAsync(command.Email);

        if (user is not null)
            throw new DomainException("User with this email already exists!");

        var passwordHasher = new PasswordHasher<string>();
        var passwordHash = passwordHasher.HashPassword(command.Email, command.Password);

        user = User.Create(command.Email, passwordHash);

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        return UserDto.FromEntity(user);
    }    
}