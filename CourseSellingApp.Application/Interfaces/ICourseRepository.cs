using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CourseSellingApp.Domain.Entities;

namespace Application.Interfaces;

public interface ICourseRepository
{
    Task<Course?> GetByIdAsync(Guid courseId);
    Task<IEnumerable<Course>> GetAllAsync();
    Task AddAsync(Course course);
    Task UpdateAsync(Course course);
    Task DeleteAsync(Guid id);
}

