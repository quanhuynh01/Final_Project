using System.ComponentModel.DataAnnotations.Schema;

namespace Backend_API.Model
{
    public class Category
    {
        public int Id { get; set; }
        public string NameCategory { get; set; }
        public string Description { get; set; }
        public string IconCate { get; set; }
        [NotMapped]
        public IFormFile ImageCateFile { get; set; } //ảnh danh mục
        public bool Show { get; set; }
        public DateTime DayCreate { get; set; } //ngày  tạo 
    }
}
