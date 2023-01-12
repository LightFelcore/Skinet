using System.Text;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers
{
    // This class is used in order to create our own caching attribute.
    // This attribute can be used in controller to determine which response (coming back from the api) should be cached.
    public class CachedAttribute : Attribute, IAsyncActionFilter
    {
        private readonly int _timeToLiveSeconds;

        public CachedAttribute(int timeToLiveSeconds)
        {
            _timeToLiveSeconds = timeToLiveSeconds;
        }

        // IMPORTANT: this method will be executed before the controller gets hit
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // Get our ResonseCacheService
            var cacheService = context.HttpContext.RequestServices.GetRequiredService<IResponseCacheService>();

            // Generate a key for the redis database. This key will be used to find the needed cached data from the database.
            // If the key exists, return the data, if the key does not exist, store the data
            var cacheKey = GenerateCacheKeyFromRequest(context.HttpContext.Request);

            var cachedResponse = await cacheService.GetGachedResponseAsync(cacheKey);

            // Check the response 
            // RETURN CACHED DATA : The response is not empty so we have something to return (cached data) to the client
            if(!string.IsNullOrEmpty(cachedResponse))
            {
                var contentResult = new ContentResult
                {
                    Content = cachedResponse,
                    ContentType = "application/json",
                    StatusCode = 200
                };

                context.Result = contentResult;

                return;
            }

            // CACHE DATA : The response is empty so we need to cache the reponse
            var executedContent = await next(); // move to the controller

            if(executedContent.Result is OkObjectResult okObjectResult)
            {
                // This line will cache the data from api to redis server
                await cacheService.CacheResponseAsync(cacheKey, okObjectResult.Value, TimeSpan.FromSeconds(_timeToLiveSeconds));
            }
        }

        private string GenerateCacheKeyFromRequest(HttpRequest request)
        {
            var keyBuilder = new StringBuilder();

            keyBuilder.Append($"{request.Path}");

            foreach (var (key, value) in request.Query.OrderBy(x => x.Key))
            {
                keyBuilder.Append($"|{key}-{value}");
            }

            return keyBuilder.ToString();
        }
    }
}