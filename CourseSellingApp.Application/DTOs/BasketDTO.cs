using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseSellingApp.Application.DTOs
{
    public class BasketDto
    {
        public Guid Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
        public List<BasketItemDto> Items { get; set; } = new();
    }

    public class BasketItemDto
    {
        public Guid CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }


}
