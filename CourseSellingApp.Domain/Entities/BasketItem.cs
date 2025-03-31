using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseSellingApp.Domain.Entities
{
    public class BasketItem
    {
        public Guid Id { get; private set; }
        public Guid CourseId { get; private set; }
        public Course Course { get; private set; } // Navigation property. Required by EF Core
        public decimal Price => Course?.Price ?? 0;

        // EF Core constructor
        private BasketItem() { }

        public BasketItem(Guid courseId)
        {
            CourseId = courseId;
        }
    }
}
