using Backend_API.Model;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Backend_API.Model
{
	public class MiniStoredentity_Context : IdentityDbContext<User>
	{
        public MiniStoredentity_Context(DbContextOptions<MiniStoredentity_Context> options) : base(options)
        { }
        public DbSet<PayMethod> PayMethods { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductThumb> ProductThumbs { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Attribute> Attributes { get; set; }
        public DbSet<Attributevalue> Attributevalues { get; set; } 
        public DbSet<MailConfig> MailConfigs { get; set; } 
        public DbSet<WistList> WistLists { get; set; } 
        public DbSet<Log> Logs { get; set; } 
  
        public DbSet<ProductAttribute> ProductAttributes { get; set; } 
        //public DbSet<CategoriesBrand> CategoriesBrands { get; set; }
        public DbSet<Backend_API.Model.CustomerSupplier> CustomerSupplier { get; set; }
        //public DbSet<CategoriesBrand> CategoriesBrands { get; set; }
        public DbSet<Backend_API.Model.Cart> Cart { get; set; }
        //public DbSet<CategoriesBrand> CategoriesBrands { get; set; }
        public DbSet<Backend_API.Model.Order> Order { get; set; }

        public DbSet<OrderDetail> OrderDetails { get; set; }
 
        public DbSet<DeliveryStatus> DeliveryStatuses { get; set; }
        public DbSet<Discount> Discounts { get; set; }
        public DbSet<Backend_API.Model.Review> Review { get; set; }


    }
}
