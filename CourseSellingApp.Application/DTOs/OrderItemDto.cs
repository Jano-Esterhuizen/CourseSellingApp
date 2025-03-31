using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseSellingApp.Application.DTOs
{
    public class OrderItemDto
    {
        public Guid CourseId { get; set; }
        public string CourseTitle { get; set; } = string.Empty; // Add Course.Title if loaded
        public decimal Price { get; set; }
    }

}
