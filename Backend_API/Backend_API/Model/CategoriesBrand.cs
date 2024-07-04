namespace Backend_API.Model
{
    public class CategoriesBrand
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public Category Category  { get; set; }
        public int BrandId  { get; set; }
        public Brand Brand  { get; set; }
    }
}
