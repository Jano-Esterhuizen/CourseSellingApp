using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseSellingApp.Domain.Entities
{
    public class Order
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public string UserId { get; private set; }
        public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
        public List<OrderItem> Items { get; private set; } = new();
        public decimal TotalPrice => Items.Sum(i => i.Price);

        private Order() { } // EF constructor

        public Order(string userId)
        {
            UserId = userId;
        }

        public void AddItem(Guid courseId, decimal price)
        {
            if (!Items.Any(i => i.CourseId == courseId))
            {
                Items.Add(new OrderItem(courseId, price));
            }
        }
    }

}
