using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseSellingApp.Domain.Entities
{
    public class Payment
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public Guid OrderId { get; private set; }
        public string? PaymentIntentId { get; private set; }
        public string ClientSecret { get; private set; } = string.Empty;
        public PaymentStatus Status { get; private set; } = PaymentStatus.Pending;
        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

        // EF Constructor
        private Payment() { }

        public Payment(Guid orderId, string? paymentIntentId, string clientSecret)
        {
            OrderId = orderId;
            PaymentIntentId = paymentIntentId;
            ClientSecret = clientSecret;
            Status = PaymentStatus.Pending;
        }

        public void MarkAsPaid()
        {
            Status = PaymentStatus.Paid;
        }
    }

}
