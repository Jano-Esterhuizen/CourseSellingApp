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
            try
            {
                await _courseService.DeleteCourseAsync(id);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "An unexpected error occurred." });
            }
        }

        [HttpPost("upload")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadThumbnail([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            if (!System.IO.File.Exists(filePath))
            {
                Console.WriteLine("Upload failed — file not saved");
            }


            return Ok(new { fileName = fileName });
        }

    }
}
