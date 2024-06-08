namespace Backend_API.Model
{
    public class Attributevalue
    {
        public int Id { get; set; }
        public string NameValue { get; set; }
        public int AttributeId { get; set; }
        public Attribute Attribute { get; set; }
    }
}
