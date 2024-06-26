namespace Backend_API.Model
{
    public class CategoryAttribute
    {
        public int Id { get; set; }
        public int AttributeId { get; set; }
        public Attribute Attribute { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
    }
}
