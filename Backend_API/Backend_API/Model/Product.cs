using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend_API.Model
{
    public class Product
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public string SKU { get; set; }
        public string Avatar { get; set; }
        [NotMapped]
        public List<IFormFile>  AvatarFile { get; set; }
        [DefaultValue(0)]
        public string Price { get; set; }
        [DefaultValue(0)]
        public string SalePrice { get; set; }
        public string Alias { get; set; }
        public Boolean BestSeller { get; set; }
        [DefaultValue(0)]
        public int Stock { get; set; }
        [DefaultValue(0)]
        public string Description { get; set; }
        public string Warranty { get; set; }
        public string WarrantyType { get; set; }
        public int BrandId { get; set; }
        public Brand Brand { get; set; }
        public DateTime DateCreate { get; set; }
        public Boolean Active { get; set; }
    }
}
