using System.Linq.Expressions;
using Core.Entities.OrderAggregate;

namespace Core.Specifications
{
    public class OrdersWithItemsAndOrderingSpecification : BaseSpecification<Order>
    {
        // This method is for GetOrdersForUserAsync() in the order service
        public OrdersWithItemsAndOrderingSpecification(string email) : base(o => o.BuyerEmail == email)
        {
            // If we want to return an order as a list, we need to add the order items and delivery method as an include
            AddInclude(o => o.OrderItems);
            AddInclude(o => o.DeliveryMethod);
            AddOrderByDescending(o => o.OrderDate);
        }

        // This method is for GetOrderByIdAsync() in the order service
        public OrdersWithItemsAndOrderingSpecification(int id, string email) 
            : base(o => o.Id == id && o.BuyerEmail == email)
        {
            // If we want to return an order as a list, we need to add the order items and delivery method as an include
            AddInclude(o => o.OrderItems);
            AddInclude(o => o.DeliveryMethod);
        }
    }
}