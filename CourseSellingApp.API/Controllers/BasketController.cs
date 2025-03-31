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
    public class BasketController : ControllerBase
    {
        private readonly IBasketService _basketService;

        public BasketController(IBasketService basketService)
        {
            _basketService = basketService;
        }

        [HttpGet]
        public async Task<IActionResult> GetBasket()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var basket = await _basketService.GetBasketAsync(userId);
            return Ok(basket);
        }

        [HttpPost("add/{courseId}")]
        public async Task<IActionResult> AddItem(Guid courseId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _basketService.AddItemToBasketAsync(userId, courseId);
            return Ok();
        }

        [HttpDelete("remove/{courseId}")]
        public async Task<IActionResult> RemoveItem(Guid courseId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _basketService.RemoveItemFromBasketAsync(userId, courseId);
            return NoContent();
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> Clear()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _basketService.ClearBasketAsync(userId);
            return NoContent();
        }
    }

}
