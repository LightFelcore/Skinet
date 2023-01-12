using API.Dtos;
using API.Errors;
using API.Extensions;
using API.Helpers;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;
        public OrdersController(IOrderService orderService, IMapper mapper)
        {
            _mapper = mapper;
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
        {
            // Get the curnrent email adres from claims principal
            var email = HttpContext.User.RetrieveEmailFromPricipal();

            // Map the order address dto to a regular adres
            var address = _mapper.Map<AddressDto, Address>(orderDto.ShipToAddress);

            // Create an order using the Order Service
            var order = await _orderService.CreateOrderAsync(email, orderDto.DeliveryMethodId, orderDto.BasketId, address);

            if (order == null) return BadRequest(new ApiResponse(400, "Problem creating order"));

            return Ok(order);
        }

        [Cached(600)]
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<OrderToReturnDto>>> GetOrdersForUser()
        {
            // Get the curnrent email adres from claims principal
            var email = HttpContext.User.RetrieveEmailFromPricipal();

            // Get the orders
            var orders = await _orderService.GetOrdersForUserAsync(email);

            var orderToReturn = _mapper.Map<IReadOnlyList<OrderToReturnDto>>(orders);

            return Ok(orderToReturn);
        }

        [Cached(600)]
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderToReturnDto>> GetOrderByIdForUser(int id)
        {
            // Get the curnrent email adres from claims principal
            var email = HttpContext.User.RetrieveEmailFromPricipal();

            var order = await _orderService.GetOrderByIdAsync(id, email);

            if (order == null) return NotFound(new ApiResponse(404));

            return Ok(_mapper.Map<Order, OrderToReturnDto>(order));
        }

        [Cached(600)]
        [HttpGet("deliveryMethods")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
        {
            return Ok(await _orderService.GetDeliveryMethodsAsync());
        }
    }
}