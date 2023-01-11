using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services
{
    // Don't forget to scope the interface with the service in the application services extensions (Program.cs)
    public class OrderService : IOrderService
    {
        private readonly IBasketRepository _basketRepo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPaymentService _paymentService;

        public OrderService(IUnitOfWork unitOfWork, IBasketRepository basketRepo, IPaymentService paymentService)
        {
            _basketRepo = basketRepo;
            _paymentService = paymentService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
        {
            /* 1. Get basket from basket repo */
            // What we trust in the basket is the quantity of an item and the items itself but not the price they have because they can change at any time.
            var basket = await _basketRepo.GetBasketAsync(basketId);

            /* 2. Get items form the product repo */
            var orderItems = new List<OrderItem>();

            // Loop through the basket items
            foreach (var item in basket.Items)
            {
                // Get the product item based on the basket item id
                var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);

                // Because the product can change we need to store the product in the database as it is at the moment ==> snapshot
                var itemOrderd = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);

                // Create an order item
                var orderItem = new OrderItem(itemOrderd, productItem.Price, item.Quantity);

                // Add the order item to the list of order items
                orderItems.Add(orderItem);
            }

            /* 3. Get the delivery method from repo */
            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);

            // Check if order exists based on the payment intent id with items
            var spec = new OrderByPaymentIntentIdSpecification(basket.PaymentIntentId);
            Order existingOrder = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            if (existingOrder != null)
            {
                _unitOfWork.Repository<Order>().Delete(existingOrder);
                await _paymentService.CreateOrUpdatePaymentIntent(basket.PaymentIntentId);
            }

            /* 4. Calculate the subtotal */
            var subtotal = orderItems.Sum(item => item.Price * item.Quantity);

            /* 5. Create the order */
            var order = new Order(buyerEmail, shippingAddress, deliveryMethod, orderItems, subtotal, basket.PaymentIntentId);

            /* 6. Save the order to the database */

            // Track the entities that need to be added to the database, this way unit of work knows
            _unitOfWork.Repository<Order>().Add(order);

            // Save the changes to the database using the unit of work complete method
            // This is possible since the uow uses our context
            var result = await _unitOfWork.Complete();

            // If this if statement is successful, means that nothing is saved to the database and null will be returned
            if (result <= 0) return null;

            /* 7. Return the order */
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(id, buyerEmail);

            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);

            return await _unitOfWork.Repository<Order>().ListAsync(spec);
        }
    }
}