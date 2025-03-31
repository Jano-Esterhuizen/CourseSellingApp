using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseSellingApp.Domain.Entities
{
    public class UserCourse
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public string UserId { get; private set; }
        public Guid CourseId { get; private set; }

        public Course Course { get; private set; } = null!;
        public DateTime EnrolledAt { get; private set; } = DateTime.UtcNow;

        public bool IsCompleted { get; private set; }
        public decimal PurchasePrice { get; private set; }

        public string ThumbnailUrl { get; private set; } = string.Empty;


        private UserCourse() { }

        public UserCourse(string userId, Guid courseId, decimal purchasePrice)
        {
            UserId = userId;
            CourseId = courseId;
            PurchasePrice = purchasePrice;
        }

        public void MarkCompleted() => IsCompleted = true;
    }
}
