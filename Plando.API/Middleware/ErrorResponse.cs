namespace Plando.API.Middleware;

public record ErrorResponse(int Status, string Error, DateTime Timestamp);