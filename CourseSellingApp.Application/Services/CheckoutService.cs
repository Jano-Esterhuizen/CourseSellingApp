using CourseSellingApp.Application.Interfaces;
using CourseSellingApp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseSellingApp.Application.Services
{
    public class CheckoutService : ICheckoutService
    {
        private readonly IBasketRepository _basketRepo;
        private readonly IOrderRepository _orderRepo;
        private readonly IUserCourseRepository _userCourseRepo;

        public CheckoutService(
            IBasketRepository basketRepo,
            IOrderRepository orderRepo,
            IUserCourseRepository userCourseRepo)
        {
            _basketRepo = basketRepo;
            _orderRepo = orderRepo;
            _userCourseRepo = userCourseRepo;
        }

        public async Task CheckoutAsync(string userId)
        {
            var basket = await _basketRepo.GetByUserIdAsync(userId)
                ?? throw new InvalidOperationException("Basket not found");

            if (!basket.Items.Any())
                throw new InvalidOperationException("Basket is empty");

            // ✅ 1. Create Order
            var order = new Order(userId);
            foreach (var item in basket.Items)
            {
                order.AddItem(item.CourseId, item.Price);
            }
            await _orderRepo.SaveAsync(order);

            // ✅ 2. Create UserCourse records
            var userCourses = basket.Items.Select(item =>
                new UserCourse(userId, item.CourseId, item.Price)).ToList();
            await _userCourseRepo.AddRangeAsync(userCourses);

            // ✅ 3. Clear basket
            basket.Clear();
            await _basketRepo.SaveAsync(basket);
        }
    }

}



