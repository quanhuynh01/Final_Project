using System.ComponentModel.DataAnnotations.Schema;

namespace Backend_API.Model
{
    public class Brand
    {
        public int Id { get; set; }
        public string BrandName { get; set; }
        public string ImageBrand { get; set; }
        [NotMapped]
        public IFormFile ImageFile { get; set; } 
        public bool Active { get; set; }
    }
}
