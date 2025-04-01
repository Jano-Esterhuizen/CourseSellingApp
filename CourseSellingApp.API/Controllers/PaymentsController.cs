using CourseSellingApp.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CourseSellingApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IStripeService _stripeService;
        private readonly ILogger<PaymentsController> _logger;

        public PaymentsController(IStripeService stripeService, ILogger<PaymentsController> logger)
        {
            _stripeService = stripeService;
            _logger = logger;
        }

        [HttpPost("checkout-session")]
        [Authorize]
        public async Task<IActionResult> CreateCheckoutSession()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var url = await _stripeService.CreateCheckoutSessionAsync(userId);
            return Ok(new { url });
        }

        [HttpPost("webhook")]
        public async Task<IActionResult> StripeWebhook()
        {
            // Get the raw JSON from the request body
            var json = await new StreamReader(Request.Body).ReadToEndAsync();

            // Extract Stripe-Signature header from request
            var stripeSignature = Request.Headers["Stripe-Signature"];

            if (string.IsNullOrEmpty(stripeSignature))
            {
                _logger.LogError("Stripe-Signature header is missing.");
                return BadRequest("Stripe-Signature header is missing.");
            }

            try
            {
                // Pass the JSON and the Stripe-Signature to the service to handle the webhook
                await _stripeService.HandleWebhookAsync(json, stripeSignature);
                return Ok(); // Return a successful response to Stripe
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error processing Stripe webhook: {ex.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }
    }

}
