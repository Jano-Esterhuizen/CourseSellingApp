using CourseSellingApp.Application.DTOs;
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
    public class OrdersController : ControllerBase
    {
        private readonly ICheckoutService _checkoutService;
        private readonly IOrderRepository _orderRepo;

        public OrdersController(ICheckoutService checkoutService, IOrderRepository orderRepo)
        {
            _checkoutService = checkoutService;
            _orderRepo = orderRepo;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            await _checkoutService.CheckoutAsync(userId);
            return Ok("Order placed successfully");
        }

        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var orders = await _orderRepo.GetOrdersByUserIdAsync(userId);

            var result = orders.Select(o => new OrderDto
            {
                Id = o.Id,
                CreatedAt = o.CreatedAt,
                TotalPrice = o.TotalPrice,
                Items = o.Items.Select(i => new OrderItemDto
                {
                    CourseId = i.CourseId,
                    Price = i.Price
                }).ToList()
            });

            return Ok(result);
        }
    }

}
