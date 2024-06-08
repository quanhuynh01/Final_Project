using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend_API.Model
{
	public class User:IdentityUser
	{
        public string Name { get; set; }
        public string FullName { get; set; }
        public string Avatar { get; set; }
        [NotMapped]
        public IFormFile AvatarFile { get; set; } 
        public DateTime Birthday { get; set; }
        public string Address { get; set; }

         
    }
}
