using Backend_API.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Mail;
using System.Net.NetworkInformation;

namespace Backend_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        [HttpGet("ImportExcel")]
        public async Task<IActionResult> ImportExcel([FromForm] IFormFile file)
        {
            
            return Ok();
        }

    }
}
