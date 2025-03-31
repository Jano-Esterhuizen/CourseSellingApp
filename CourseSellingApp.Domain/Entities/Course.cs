//Course.cs

using System;

namespace CourseSellingApp.Domain.Entities
{
    public class Course
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public string Title { get;  set; }
        public string Description { get;  set; }
        public decimal Price { get;  set; }
        public string Instructor { get;  set; }
        public string Category { get;  set; }
        public string ThumbnailUrl { get; set; } = string.Empty;


        // Private constructor for EF Core or serialization
        private Course() { }

        public Course(string title, string description, decimal price, string instructor, string category, string thumbnailUrl)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Title is required.", nameof(title));
            if (price < 0)
                throw new ArgumentException("Price cannot be negative.", nameof(price));

            Title = title;
            Description = description;
            Price = price;
            Instructor = instructor;
            Category = category;
            ThumbnailUrl = thumbnailUrl;
        }
    }
}