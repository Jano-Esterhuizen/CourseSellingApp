using System;

namespace CourseSellingApp.Application.DTOs
{
    public class CourseDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Instructor { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
    }
}
