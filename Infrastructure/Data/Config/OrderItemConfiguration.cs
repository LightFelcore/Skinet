using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            // Order item has a one to one relationship with Product Item Ordered
            builder.OwnsOne(i => i.ItemOrdered, io => io.WithOwner());

            // Order has a decimal(18,2) for price field
            builder.Property(i => i.Price).HasColumnType("decimal(18,2)");
        }
    }
}