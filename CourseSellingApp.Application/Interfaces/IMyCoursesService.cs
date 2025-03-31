using CourseSellingApp.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseSellingApp.Application.Interfaces
{
    public interface IMyCoursesService
    {
        Task<List<MyCourseDto>> GetPurchasedCoursesAsync(string userId);
    }

}
