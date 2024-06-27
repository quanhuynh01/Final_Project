namespace Backend_API.Model
{
    public class Review
    {
        public int Id { get; set; } 
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public string Email { get; set; }
        public string Content { get; set; }
        public string Name { get; set; }
        public DateTime DateComment { get; set; }
        public int Rating { get; set; }
    }
}
