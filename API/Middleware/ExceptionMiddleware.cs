using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using API.Errors;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _env = env;
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context) {
            try
            {
                // If there is not exception, the middleware is moving to his next stage
                await _next(context);
            }
            catch (System.Exception ex)
            {
                // If there is an exception
                _logger.LogError(ex, ex.Message);
                // Set content type to JSON
                context.Response.ContentType = "application/json";
                // Set the status code as qn integer for an internal server error
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                // Format the response //
                // Check to see if we are in development mode or production mode
                var response = _env.IsDevelopment()
                    ? new ApiException((int)HttpStatusCode.InternalServerError, ex.Message, ex.StackTrace.ToString())
                    : new ApiException((int)HttpStatusCode.InternalServerError);

                // The response to the client must be in CamelCase
                var options = new JsonSerializerOptions{
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };
                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);
            }
        }
    }
}