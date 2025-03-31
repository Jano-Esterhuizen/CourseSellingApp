using CourseSellingApp.Application.Interfaces;
using CourseSellingApp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Collections.Specialized.BitVector32;
using CourseSellingApp.Shared.Config;
using Microsoft.Extensions.Options;
using Stripe.Checkout;
using Stripe;
using Application.Interfaces;

namespace CourseSellingApp.Application.Services
{
    public class StripeService : IStripeService
    {
        private readonly IBasketRepository _basketRepo;
        private readonly IOrderRepository _orderRepo;
        private readonly IPaymentRepository _paymentRepo;
        private readonly IUserCourseRepository _userCourseRepo;
        private readonly IOptions<StripeOptions> _options;
        private readonly ICourseRepository _courseRepo;


        public StripeService(
            IBasketRepository basketRepo,
            IOrderRepository orderRepo,
            IPaymentRepository paymentRepo,
            IUserCourseRepository userCourseRepo,
            IOptions<StripeOptions> options,
            ICourseRepository courseRepo
)
        {
            _basketRepo = basketRepo;
            _orderRepo = orderRepo;
            _paymentRepo = paymentRepo;
            _userCourseRepo = userCourseRepo;
            _options = options;
            _courseRepo = courseRepo; 
        }


        public async Task<string> CreateCheckoutSessionAsync(string userId)
        {
            StripeConfiguration.ApiKey = _options.Value.SecretKey;

            var basket = await _basketRepo.GetByUserIdAsync(userId)
                ?? throw new Exception("Basket not found");

            var order = new Order(userId);
            foreach (var item in basket.Items)
            {
                order.AddItem(item.CourseId, item.Price);
            }

            await _orderRepo.SaveAsync(order);

            // Check if the basket has any items
            if (!basket.Items.Any())
            {
                throw new Exception("No items in the basket.");
            }

            // Ensure there are items in the order
            if (order.Items.Count == 0)
            {
                throw new Exception("No items in the order.");
            }

            // Prepare the line items for the checkout session
            var lineItems = new List<SessionLineItemOptions>();

            foreach (var item in order.Items)
            {
                // Fetch the course based on CourseId
                var course = await _courseRepo.GetByIdAsync(item.CourseId);
                if (course == null)
                {
                    throw new Exception($"Course not found for CourseId: {item.CourseId}");
                }

                // Create line item for Stripe
                var lineItem = new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = "usd",
                        UnitAmount = (long)(item.Price * 100), // cents
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = course.Title // Use course name here
                        }
                    },
                    Quantity = 1
                };
                lineItems.Add(lineItem);
            }

            // Make sure lineItems is not empty
            if (!lineItems.Any())
            {
                throw new Exception("Line items are empty.");
            }

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = lineItems,
                Mode = "payment",
                SuccessUrl = "https://localhost:5173/payment-success",
                CancelUrl = "https://localhost:5173/payment-cancel"
            };

            var service = new SessionService();
            var session = await service.CreateAsync(options);

            var payment = new Payment(order.Id, session.PaymentIntentId!, session.Id);
            await _paymentRepo.AddAsync(payment);
            await _paymentRepo.SaveChangesAsync();

            return session.Url!;
        }



        public async Task HandleWebhookAsync(string json, string stripeSignature)
        {
            var stripeEvent = EventUtility.ConstructEvent(
                json,
                stripeSignature,
                _options.Value.WebhookSecret
            );

            if (string.IsNullOrEmpty(stripeSignature))
            {
                throw new ArgumentNullException(nameof(stripeSignature), "Stripe Signature is null or empty.");
            }

            if (string.IsNullOrEmpty(json))
            {
                throw new ArgumentNullException(nameof(json), "Stripe Event JSON is null or empty.");
            }


            if (stripeEvent.Type == "checkout.session.completed")

            {
                var session = stripeEvent.Data.Object as Session;

                var payment = await _paymentRepo.GetByPaymentIntentIdAsync(session.PaymentIntentId!);
                if (payment == null) return;

                payment.MarkAsPaid();
                await _paymentRepo.SaveChangesAsync();

                var order = await _orderRepo.GetByIdAsync(payment.OrderId);
                if (order == null) return;

                var userCourses = order.Items.Select(i =>
                    new UserCourse(order.UserId, i.CourseId, i.Price)).ToList();

                await _userCourseRepo.AddRangeAsync(userCourses);
                await _paymentRepo.SaveChangesAsync();
            }
        }
    }

}
