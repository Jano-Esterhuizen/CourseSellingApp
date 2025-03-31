﻿using CourseSellingApp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseSellingApp.Application.Interfaces
{
    public interface IOrderRepository
    {
        Task SaveAsync(Order order);
        Task<List<Order>> GetOrdersByUserIdAsync(string userId);
    }
}
