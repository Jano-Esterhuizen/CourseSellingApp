using CourseSellingApp.Application.Interfaces;
using CourseSellingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseSellingApp.Infrastructure.Repositories
{
    public class UserCourseRepository : IUserCourseRepository
    {
        private readonly AppDbContext _context;

        public UserCourseRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserCourse>> GetUserCoursesAsync(string userId)
        {
            return await _context.UserCourses
                .Where(uc => uc.UserId == userId)
                .Include(uc => uc.Course)
                .ToListAsync();
        }

        public async Task AddAsync(UserCourse userCourse)
        {
            await _context.UserCourses.AddAsync(userCourse);
        }

        public async Task AddRangeAsync(List<UserCourse> courses)
        {
            await _context.UserCourses.AddRangeAsync(courses);
        }
    }

}
