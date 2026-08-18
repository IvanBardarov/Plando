using Plando.Domain.Exceptions;

namespace Plando.Domain.Entities;

public sealed class User
{
    private User() { }

    /// <summary>
    /// Factory method - a static method that encapsulates the creation and validation of an object,
    /// returning a fully initialized instance.
    /// Creates a new User with the given email and password hash.
    /// Throws <see cref="DomainException"/> if any argument is invalid.
    /// </summary>
    /// <param name="email"></param>
    /// <param name="passwordHash"></param>
    /// <returns></returns>
    /// <exception cref="DomainException"></exception>
    public static User Create(string email, string passwordHash)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new DomainException("User.Create: email can not be empty!");

        if (string.IsNullOrWhiteSpace(passwordHash))
            throw new DomainException("User.Create: password can not be empty!");

        return new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            PasswordHash = passwordHash,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Update(string newPassword)
    {
        PasswordHash = newPassword;
    }

    public Guid Id { get; init; }
    public required string Email { get; init; }
    public string PasswordHash { get; private set; }
    public DateTime CreatedAt { get; init; }
    public ICollection<TaskItem> TaskItems { get; init; } = [];
    public ICollection<TaskList> TaskLists { get; init; } = []; 
}