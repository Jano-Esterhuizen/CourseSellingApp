using CourseSellingApp.Application.Interfaces;
using CourseSellingApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseSellingApp.Infrastructure.Repositories
{
    public class BasketRepository : IBasketRepository
    {
        private readonly AppDbContext _context;

        public BasketRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Basket?> GetByUserIdAsync(string userId)
        {
            return await _context.Baskets
                .Include(b => b.Items)
                .ThenInclude(i => i.Course)
                .FirstOrDefaultAsync(b => b.UserId == userId);
        }

        public async Task SaveAsync(Basket incomingBasket)
        {
            // Get tracked basket from DB
            var tracked = await _context.Baskets
                .Include(b => b.Items)
                .FirstOrDefaultAsync(b => b.UserId == incomingBasket.UserId);

            if (tracked == null)
            {
                // First-time basket for this user
                await _context.Baskets.AddAsync(incomingBasket);
            }
            else
            {
                // Only add new items that aren't already in DB
                var existingCourseIds = tracked.Items.Select(i => i.CourseId).ToHashSet();

                foreach (var newItem in incomingBasket.Items)
                {
                    if (!existingCourseIds.Contains(newItem.CourseId))
                    {
                        tracked.Items.Add(new BasketItem(newItem.CourseId));
                    }
                }

                // Nothing else needs updating. Let EF track changes
            }

            await _context.SaveChangesAsync();
        }


    }

}
