using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseSellingApp.Domain.Entities
{
    public class OrderItem
    {
        public Guid Id { get; private set; }
        public Guid CourseId { get; private set; }
        public decimal Price { get; private set; }

        private OrderItem() { } // EF

        public OrderItem(Guid courseId, decimal price)
        {
            CourseId = courseId;
            Price = price;
        }
    }

}
