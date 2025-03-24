using CourseSellingApp.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces;

public interface ICourseService
{
    Task<CourseDTO?> GetCourseByIdAsync(Guid id);
    Task<IEnumerable<CourseDTO>> GetAllCoursesAsync();
    Task AddCourseAsync(CourseDTO course);
    public Task<CourseDTO> UpdateCourseAsync(CourseDTO courseDTO);

    Task DeleteCourseAsync(Guid id);
}
