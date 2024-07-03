namespace Backend_API.Model
{
    public class ProductAttribute
    {
        public int Id { get; set; }
        public int AttributeId { get; set; }
        public Attribute Attribute { get; set; }
        //khoá ngoại đến sản phẩm
        public int ProductId { get; set; }
        public Product Product { get; set; }

        public int AttributeValueId { get; set; }
    }
}