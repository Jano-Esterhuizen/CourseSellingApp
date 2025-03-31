using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseSellingApp.Domain.Entities
{
    public class Basket
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public string UserId { get; private set; } // Ties basket to IdentityUser
        public List<BasketItem> Items { get; private set; } = new();
        public decimal TotalPrice => Items.Sum(item => item.Price);

        // Constructor for EF Core
        private Basket() { }

        public Basket(string userId)
        {
            UserId = userId;
        }

        public void AddItem(Guid courseId)
        {
            if (Items.Any(i => i.CourseId == courseId)) return;
            Items.Add(new BasketItem(courseId));
        }


        public void Clear() => Items.Clear();
    }
}
