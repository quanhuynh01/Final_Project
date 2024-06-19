namespace Backend_API.Model
{
    public class Log
    {
        public int Id { get; set; } 
        public string NameAction { get; set; }
        public string DescriptionAction { get; set; }
        public DateTime DateAction { get; set; }
    }
}
