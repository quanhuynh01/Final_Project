using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;

namespace Backend_API.Model
{
    public class DiscountProducts
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }

        public int DiscountId { get; set; }
        public Discount Discount { get; set; }
    }
}
