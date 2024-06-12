using System.ComponentModel.DataAnnotations.Schema;

namespace Backend_API.Model
{
    public class ProductThumb
    {
        public int Id { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }
        public string Image { get; set; } 
        public bool IsMain { get; set; }
       

    }
}
