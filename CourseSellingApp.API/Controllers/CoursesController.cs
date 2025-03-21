using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CourseSellingApp.Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace CourseSellingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CoursesController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CoursesController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var courses = await _courseService.GetAllCoursesAsync();
            return Ok(courses);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var course = await _courseService.GetCourseByIdAsync(id);
            return course == null ? NotFound() : Ok(course);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CourseDTO course)
        {
            await _courseService.AddCourseAsync(course);
            return CreatedAtAction(nameof(GetById), new { id = course.Id }, course);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, CourseDTO course)
        {
            if (id != course.Id)
                return BadRequest();

            await _courseService.UpdateCourseAsync(course);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _courseService.DeleteCourseAsync(id);
            return NoContent();
        }
    }
}
