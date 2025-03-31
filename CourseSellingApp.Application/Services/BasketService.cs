using Application.Interfaces;
using CourseSellingApp.Application.DTOs;
using CourseSellingApp.Application.Interfaces;
using CourseSellingApp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseSellingApp.Application.Services
{
    public class BasketService : IBasketService
    {
        private readonly IBasketRepository _basketRepository;
        private readonly ICourseRepository _courseRepository;

        public BasketService(IBasketRepository basketRepository, ICourseRepository courseRepository)
        {
            _basketRepository = basketRepository;
            _courseRepository = courseRepository;
        }

        public async Task<BasketDto> GetBasketAsync(string userId)
        {
            var basket = await _basketRepository.GetByUserIdAsync(userId);
            return MapToDto(basket ?? new Basket(userId));
        }

        public async Task AddItemToBasketAsync(string userId, Guid courseId)
        {
            var course = await _courseRepository.GetByIdAsync(courseId)
                ?? throw new InvalidOperationException("Course not found");

            var basket = await _basketRepository.GetByUserIdAsync(userId) ?? new Basket(userId);
            basket.AddItem(courseId); // use Guid-based method

            await _basketRepository.SaveAsync(basket);
        }

        public async Task RemoveItemFromBasketAsync(string userId, Guid courseId)
        {
            var basket = await _basketRepository.GetByUserIdAsync(userId);
            if (basket == null) return;

            basket.Items.RemoveAll(i => i.CourseId == courseId);
            await _basketRepository.SaveAsync(basket);
        }

        public async Task ClearBasketAsync(string userId)
        {
            var basket = await _basketRepository.GetByUserIdAsync(userId);
            if (basket == null) return;

            basket.Clear();
            await _basketRepository.SaveAsync(basket);
        }

        private BasketDto MapToDto(Basket basket) =>
            new BasketDto
            {
                Id = basket.Id,
                UserId = basket.UserId,
                TotalPrice = basket.TotalPrice,
                Items = basket.Items.Select(i => new BasketItemDto
                {
                    CourseId = i.CourseId,
                    Title = i.Course?.Title ?? "",
                    Price = i.Price
                }).ToList()
            };
    }

}
