using System;

namespace CourseSellingApp.Domain.Entities
{
    public class Course
    {
        public Guid Id { get; private set; } = Guid.NewGuid();
        public string Title { get; private set; }
        public string Description { get; private set; }
        public decimal Price { get; private set; }
        public string Instructor { get; private set; }
        public string Category { get; private set; }
        public string ThumbnailUrl { get; private set; }

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