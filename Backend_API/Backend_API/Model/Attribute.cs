namespace Backend_API.Model
{
    public class Attribute
    {
        public int Id { get; set; }
        public string NameAttribute { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
    }
}
