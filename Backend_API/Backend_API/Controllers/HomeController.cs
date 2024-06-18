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
        [HttpGet]
        public async Task<IActionResult> Sendmail()
        {
            MailMessage mailMessage = new MailMessage();

            SmtpClient smtpClient = new SmtpClient();
            {
                smtpClient.Host = "smtp.gmail.com";
                smtpClient.Port = 587;
                smtpClient.EnableSsl = true;
                //UserName và Password của mail
                smtpClient.Credentials = new NetworkCredential("quanhuynh855@gmail.com", "15112003Q"); 
                 
                smtpClient.Send("0306211073@caothang.edu.vn", "Text", "Subject", "Message"); 
            }

            return Ok();
        }

    }
}
