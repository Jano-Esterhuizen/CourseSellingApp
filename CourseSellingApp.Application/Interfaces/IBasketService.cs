using CourseSellingApp.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseSellingApp.Application.Interfaces
{
    public interface IBasketService
    {
        Task<BasketDto> GetBasketAsync(string userId);
        Task AddItemToBasketAsync(string userId, Guid courseId);
        Task RemoveItemFromBasketAsync(string userId, Guid courseId);
        Task ClearBasketAsync(string userId);
    }
}
