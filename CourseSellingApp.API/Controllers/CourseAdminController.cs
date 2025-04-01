using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CourseSellingApp.Application.DTOs;
using Application.Interfaces;

namespace CourseSellingApp.API.Controllers.Admin
{
    [Authorize(Roles = "Admin")] // ✅ Protect all endpoints
    [ApiController]
    [Route("api/admin/[controller]")]
    public class CourseAdminController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CourseAdminController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CourseDto course)
        {
            await _courseService.AddCourseAsync(course);
            return CreatedAtAction(nameof(Create), new { id = course.Id }, course);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] CourseDto course)
        {
            Console.WriteLine($"Received ID: {id}, Course ID in DTO: {course.Id}");
            if (id != course.Id)
            {
                return BadRequest("ID mismatch between URL and body");
            }

            var updatedCourse = await _courseService.UpdateCourseAsync(course);
            return Ok(updatedCourse);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _courseService.DeleteCourseAsync(id);
            return NoContent();
        }
    }
}
