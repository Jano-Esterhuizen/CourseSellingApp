using CourseSellingApp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseSellingApp.Application.Interfaces
{
    public interface IUserCourseRepository
    {
        Task<List<UserCourse>> GetUserCoursesAsync(string userId);
        Task AddAsync(UserCourse userCourse);
        Task AddRangeAsync(List<UserCourse> courses);
    }

}
