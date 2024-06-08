using System.ComponentModel.DataAnnotations.Schema;

namespace Backend_API.Model
{
    public class CustomerSupplier
    {
        public int Id { get; set; } 
        public string CompanyName { get; set; }
        public string Image { get; set; }
        [NotMapped]
        public IFormFile ImageFile { get; set; }
        public string Address { get; set; } 
        public string Phone { get; set; } 
        public string Email { get; set; } 
        public int Level { get; set; } 
        public bool Active { get; set; } 
         
    }
}
