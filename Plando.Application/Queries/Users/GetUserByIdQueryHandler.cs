using Plando.Application.DTOs;
using Plando.Application.Interfaces;
using Plando.Domain.Exceptions;

namespace Plando.Application.Queries.Users;

public class GetUserByIdQueryHandler
{
    private readonly IUserRepository _userRepository;

    public GetUserByIdQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserDto> HandleAsync(GetUserByIdQuery query)
    {
        var user = await _userRepository.GetByIdAsync(query.UserId);

        if (user is null)
            throw new DomainException($"There is not such an user with id = {query.UserId}!");

        return UserDto.FromEntity(user);
    }
}