using Plando.Domain.Exceptions;

namespace Plando.API.Middleware;

public class ExceptionHandlingMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch(DomainException ex)
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsJsonAsync(
                new ErrorResponse(context.Response.StatusCode, ex.Message, DateTime.UtcNow));
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = 500;
            await context.Response.WriteAsJsonAsync(
                new ErrorResponse(context.Response.StatusCode, ex.Message, DateTime.UtcNow));
        }
    }
}