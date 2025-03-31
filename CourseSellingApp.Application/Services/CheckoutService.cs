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

        public CheckoutService(IBasketRepository basketRepo, IOrderRepository orderRepo)
        {
            _basketRepo = basketRepo;
            _orderRepo = orderRepo;
        }

        public async Task CheckoutAsync(string userId)
        {
            var basket = await _basketRepo.GetByUserIdAsync(userId)
                ?? throw new InvalidOperationException("Basket not found");

            if (!basket.Items.Any())
                throw new InvalidOperationException("Basket is empty");

            var order = new Order(userId);

            foreach (var item in basket.Items)
            {
                order.AddItem(item.CourseId, item.Price);
            }

            await _orderRepo.SaveAsync(order);

            basket.Clear();
            await _basketRepo.SaveAsync(basket);
        }
    }

}
