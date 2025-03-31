using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using CourseSellingApp.Application.DTOs;
using CourseSellingApp.Domain.Entities;

namespace CourseSellingApp.Application.Services
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _courseRepository; // Already created in Step 1

        public CourseService(ICourseRepository courseRepository)
        {
            _courseRepository = courseRepository;
        }

        public async Task<CourseDto?> GetCourseByIdAsync(Guid id)
        {
            var course = await _courseRepository.GetByIdAsync(id);
            return course == null ? null : MapToDTO(course);
        }

        public async Task<IEnumerable<CourseDto>> GetAllCoursesAsync()
        {
            var courses = await _courseRepository.GetAllAsync();
            return courses.Select(MapToDTO);
        }

        public async Task AddCourseAsync(CourseDto courseDTO)
        {
            var course = new Course(courseDTO.Title, courseDTO.Description, courseDTO.Price,
                                    courseDTO.Instructor, courseDTO.Category, courseDTO.ThumbnailUrl);
            await _courseRepository.AddAsync(course);
        }

        public async Task<CourseDto> UpdateCourseAsync(CourseDto courseDTO)
        {
            var course = await _courseRepository.GetByIdAsync(courseDTO.Id);
            if (course == null)
            {
                throw new InvalidOperationException($"Course with ID {courseDTO.Id} not found.");
            }

            // Update properties
            course.Title = courseDTO.Title;
            course.Description = courseDTO.Description;
            course.Price = courseDTO.Price;
            course.Instructor = courseDTO.Instructor;
            course.Category = courseDTO.Category;
            course.ThumbnailUrl = courseDTO.ThumbnailUrl;

            await _courseRepository.UpdateAsync(course); // <- Ensure this doesn't return void

            return courseDTO; // <- Make sure to return the updated DTO
        }

        public async Task DeleteCourseAsync(Guid id)
        {
            await _courseRepository.DeleteAsync(id);
        }

        private CourseDto MapToDTO(Course course) =>
            new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Price = course.Price,
                Instructor = course.Instructor,
                Category = course.Category,
                ThumbnailUrl = course.ThumbnailUrl
            };

        
    }
}
