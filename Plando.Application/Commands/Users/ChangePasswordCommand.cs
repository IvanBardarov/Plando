namespace Plando.Application.Commands.Users;

public record ChangePasswordCommand(Guid Id, string OldPassword, string NewPassword);