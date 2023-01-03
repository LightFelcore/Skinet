using API.Errors;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Extensions
{
    // This class extension is made in order to keep the Porgram.cs more clean and readable
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services) {
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IBasketRepository, BasketRepository>();

            // In case of validation errors
            services.Configure<ApiBehaviorOptions>(options => {
                options.InvalidModelStateResponseFactory = actionContext => 
                {
                    var errors = actionContext.ModelState
                        .Where(error => error.Value.Errors.Count > 0)
                        .SelectMany(x => x.Value.Errors)
                        .Select(x => x.ErrorMessage)
                        .ToArray();
                    var errorResponse = new ApiValidationErrorResponse
                    {
                        Errors = errors
                    };
                    return new BadRequestObjectResult(errorResponse);
                };
            });

            return services;
        }
    }
}