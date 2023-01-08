using System.Runtime.Serialization;

namespace Core.Entities.OrderAggregate
{
    public enum OrderStatus
    {
        // Give back the enum as a value
        [EnumMember(Value = "Pending")]
        // When the order is submitted
        Pending,

        // Give back the enum as a value
        [EnumMember(Value = "Payment Received")]
        // When the payment has been received from the client
        PaymentReceived,

        // Give back the enum as a value
        [EnumMember(Value = "Payment Failed")]
        // When the was rejected or something went wrong
        PaymentFailed
    }
}