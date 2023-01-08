using System.Text.Json;
using Core.Entities;
using Core.Interfaces;
using StackExchange.Redis;

namespace Infrastructure.Data
{
    public class BasketRepository : IBasketRepository
    {
        private readonly IDatabase _database;

        public BasketRepository(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase();
        }
        public async Task<bool> DeleteBasketAsync(string basketId)
        {
            return await _database.KeyDeleteAsync(basketId);
        }

        public async Task<CustomerBasket> GetBasketAsync(string basketId)
        {
            // Serialize the json data for this specific basketId into a string
            var data = await _database.StringGetAsync(basketId);

            // If there is data available, deserialize it into a CustomerBasket object
            return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<CustomerBasket>(data);
        }

        public async Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket)
        {
            // Updating means, ovveride everything with the basket comming in as parameter
            // Set a timespan of 30 days as time to live for our baskets.
            var created = await _database.StringSetAsync(basket.Id, JsonSerializer.Serialize(basket), TimeSpan.FromDays(30));

            // Check if the basket hasn't been created
            if(!created) return null;

            // Return the created basket while using the custom GetBasketAsync() method
            return await GetBasketAsync(basket.Id);
        }
    }
}