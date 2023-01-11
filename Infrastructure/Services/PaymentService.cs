using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _config;

        public PaymentService(IBasketRepository basketRepository, IUnitOfWork unitOfWork, IConfiguration config)
        {
            _basketRepository = basketRepository;
            _config = config;
            _unitOfWork = unitOfWork;
        }

        public async Task<CustomerBasket> CreateOrUpdatePaymentIntent(string basketId)
        {
            // Secret key from application.json (API folder)
            StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];

            // Get the basket
            var basket = await _basketRepository.GetBasketAsync(basketId);

            if(basket == null) return null;

            var shippingPrice = 0m;

            // Check if there is a delivery method set in the basket
            if (basket.DeliveryMethodId.HasValue)
            {
                // Take the delivery method from the database using the uom pattern
                var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync((int)basket.DeliveryMethodId);

                // Set the shipping price
                shippingPrice = deliveryMethod.Price;
            }

            foreach (var item in basket.Items)
            {
                // Get the product based upon the basket id
                var productItem = await _unitOfWork.Repository<Core.Entities.Product>().GetByIdAsync(item.Id);

                // Check the product price
                if (item.Price != productItem.Price)
                {
                    item.Price = productItem.Price;
                }
            }

            var service = new PaymentIntentService();

            PaymentIntent intent;

            // Check if we create or update a payment intent

            // New Payment Intent
            if (string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                // Options for the payment intent
                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long)basket.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)shippingPrice * 100,
                    Currency = "usd",
                    PaymentMethodTypes = new List<string> { "card" }
                };

                // Create the intent with options
                intent = await service.CreateAsync(options);

                // Update the basket properties with the intent data
                basket.PaymentIntentId = intent.Id;
                basket.ClientSecret = intent.ClientSecret;
            }
            // Update Payment Intent ==> This situation occurs when the client went to the checkout leaves the application and comes back for the payment
            else
            {
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = (long)basket.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long)shippingPrice * 100
                };

                await service.UpdateAsync(basket.PaymentIntentId, options);
            }

            // Update the client basket
            await _basketRepository.UpdateBasketAsync(basket);

            return basket;
        }

        public async Task<Order> UpdateOrderPaymentFailed(string paymentIntentId)
        {
            var spec = new OrderByPaymentIntentIdSpecification(paymentIntentId);
            var order = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            if(order == null) return null;

            // Set the order status to PaymentFailed
            order.Status = OrderStatus.PaymentFailed;

            await _unitOfWork.Complete();

            return order;
        }

        public async Task<Order> UpdateOrderPaymentSucceeded(string paymentIntentId)
        {
            var spec = new OrderByPaymentIntentIdSpecification(paymentIntentId);
            var order = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            if(order == null) return null;

            // Set the order status to PaymentRecieved
            order.Status = OrderStatus.PaymentReceived;

            // Update the order
            _unitOfWork.Repository<Order>().Update(order);

            // Save the changes to the database
            await _unitOfWork.Complete();

            return order;
        }
    }
}