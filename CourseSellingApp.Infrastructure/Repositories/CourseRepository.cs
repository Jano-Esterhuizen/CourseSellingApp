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
            var course = await GetByIdAsync(id);
            if (course != null)
            {
                _context.Courses.Remove(course);
                await _context.SaveChangesAsync();
            }
        }
    }
}
