﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseSellingApp.Application.Interfaces
{
    public interface ICheckoutService
    {
        Task CheckoutAsync(string userId);
    }

}
