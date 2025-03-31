using CourseSellingApp.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CourseSellingApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MyCoursesController : ControllerBase
    {
        private readonly IMyCoursesService _service;

        public MyCoursesController(IMyCoursesService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var courses = await _service.GetPurchasedCoursesAsync(userId);
            return Ok(courses);
        }
    }

}
