using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IMapper _mapper;

        public BasketController(IBasketRepository basketRepository, IMapper mapper)
        {
            _basketRepository = basketRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<CustomerBasket>> GetBasketById(string id) {
            var basket = await _basketRepository.GetBasketAsync(id);
            
            // If the basket is null return a new CustomerBasket with an empti List<BasketItems>, otherwise return the basket
            return Ok(basket ?? new CustomerBasket(id));
        }

        [HttpPost]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasketDto basket) {
            // Map the Customer Basket to a Customer Basket Dto
            var customerBasket = _mapper.Map<CustomerBasketDto, CustomerBasket>(basket);

            var updatedBasket = await _basketRepository.UpdateBasketAsync(customerBasket);

            return Ok(updatedBasket ?? new CustomerBasket(basket.Id));
        }

        [HttpDelete]
        public async Task DeleteBasketAsync(string id) {
            await _basketRepository.DeleteBasketAsync(id);
        }
    }
}