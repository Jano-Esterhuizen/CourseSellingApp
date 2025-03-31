using CourseSellingApp.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces;

public interface ICourseService
{
    Task<CourseDto?> GetCourseByIdAsync(Guid id);
    Task<IEnumerable<CourseDto>> GetAllCoursesAsync();
    Task AddCourseAsync(CourseDto course);
    public Task<CourseDto> UpdateCourseAsync(CourseDto courseDTO);
    Task DeleteCourseAsync(Guid id);
}
