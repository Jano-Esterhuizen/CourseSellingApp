using CourseSellingApp.Application.DTOs;
using CourseSellingApp.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseSellingApp.Application.Services
{
    public class MyCoursesService : IMyCoursesService
    {
        private readonly IUserCourseRepository _repo;

        public MyCoursesService(IUserCourseRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<MyCourseDto>> GetPurchasedCoursesAsync(string userId)
        {
            var userCourses = await _repo.GetUserCoursesAsync(userId);

            return userCourses.Select(uc => new MyCourseDto
            {
                CourseId = uc.CourseId,
                Title = uc.Course.Title,
                Description = uc.Course.Description,
                Price = uc.PurchasePrice,
                ThumbnailUrl = uc.Course.ThumbnailUrl,
                EnrolledAt = uc.EnrolledAt,
                IsCompleted = uc.IsCompleted
            }).ToList();
        }
    }

}
