﻿using System.ComponentModel.DataAnnotations.Schema;

namespace Backend_API.Model
{
    public class Discount
    {
        public int Id { get; set; }
        public string  Title { get; set; } 
        public int Price { get; set; }
        public string Banner { get; set; }
        [NotMapped]
        public IFormFile BannerFile { get; set; }
        public DateTime TimeCreate { get; set; }
        public DateTime TimeEnd { get; set; }
        public bool Show { get; set; }
        
    }
}
