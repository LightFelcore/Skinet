using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly IBasketRepository _basketRepository;

        public BasketController(IBasketRepository basketRepository)
        {
            _basketRepository = basketRepository;
        }

        [HttpGet]
        public async Task<ActionResult<CustomerBasket>> GetBasketById(string id) {
            var basket = await _basketRepository.GetBasketAsync(id);
            // If the basket is null return a new CustomerBasket with an empti List<BasketItems>, otherwise return the basket
            return Ok(basket ?? new CustomerBasket(id));
        }

        [HttpPost]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasket basket) {
            var updatedBasket = await _basketRepository.UpdateBasketAsync(basket);
            return Ok(updatedBasket ?? new CustomerBasket(basket.Id));
        }

        [HttpDelete]
        public async Task DeleteBasketAsync(string id) {
            await _basketRepository.DeleteBasketAsync(id);
        }
    }
}