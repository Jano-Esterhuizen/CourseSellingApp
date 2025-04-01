//CourseRepository.cs

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Interfaces;
using CourseSellingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CourseSellingApp.Infrastructure.Repositories
{
    public class CourseRepository : ICourseRepository
    {
        private readonly AppDbContext _context;

        public CourseRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Course?> GetByIdAsync(Guid id) =>
            await _context.Courses.FindAsync(id);

        public async Task<IEnumerable<Course>> GetAllAsync() =>
            await _context.Courses.ToListAsync();

        public async Task AddAsync(Course course)
        {
            _context.Courses.Add(course);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Course course)
        {
            _context.Courses.Update(course);
            await _context.SaveChangesAsync();  // Ensure this is awaited
        }

        public async Task DeleteAsync(Guid id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
                throw new Exception("Course not found");

            // Check if it's referenced in other tables
            var isInUse = await _context.BasketItems.AnyAsync(b => b.CourseId == id)
                       || await _context.OrderItems.AnyAsync(o => o.CourseId == id)
                       || await _context.UserCourses.AnyAsync(u => u.CourseId == id);

            if (isInUse)
                throw new Exception("Cannot delete: Course is in use by other records");

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
        }
    }
}
