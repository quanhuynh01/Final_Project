
using Backend_API.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Net;
using System.Security.Claims;
using System.Text;
using MimeKit;
using MailKit.Security;
using MimeKit.Text;
using MailKit.Net.Smtp;
namespace API_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly MiniStoredentity_Context _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public UsersController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, MiniStoredentity_Context context, IWebHostEnvironment webHostEnvironment)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _userManager.Users.ToListAsync();
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([Bind("Username, Password")] LoginModel account)
        {
            var user = await _userManager.FindByNameAsync(account.Username);
            if (user != null && await _userManager.CheckPasswordAsync(user, account.Password))
            {
                var userRoles = await _userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

                var token = new JwtSecurityToken(
                    issuer: _configuration["JWT:ValidIssuer"],
                    audience: _configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddHours(3),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                    );

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo
                });
            }
            return Unauthorized();
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register(RegisterModel model)
        {
            var userExists = await _userManager.FindByNameAsync(model.Username);
            if (userExists != null)
            {
                return Ok(new { success = false, status = 0 });//status = 0 tên người dùng tồn tại
            }
            User user = new User()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username,
                FullName = model.Fullname,
                PhoneNumber = model.Phone
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return Ok(new { success = false, status = 1 });//status = 1 mật khẩu không đúng định dạng
            }
            _ = SendMail(user.Email, user.FullName);
            return Ok(new { success = true });
        }

        [HttpPost]
        [Route("editUser/{id}")]
        public async Task<IActionResult> editUser(string id, string fullName, string userName, string email)
        {
            var dataUser = _context.Users.Find(id);
            dataUser.FullName = fullName;
            dataUser.UserName = userName;
            dataUser.Email = email;
            _context.Users.Update(dataUser);
            _context.SaveChanges();
            return Ok(dataUser);
        }


        [HttpPost]
        [Route("register-admin")]
        public async Task<IActionResult> RegisterAdmin(string Username, string Password, string Email)
        {
            var userExists = await _userManager.FindByNameAsync(Username);
            if (userExists != null)
                return StatusCode(StatusCodes.Status500InternalServerError);

            User user = new User()
            {
                Email = Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = Username
            };
            var result = await _userManager.CreateAsync(user, Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError);

            if (!await _roleManager.RoleExistsAsync("Admin"))
                await _roleManager.CreateAsync(new IdentityRole("Admin"));
            if (!await _roleManager.RoleExistsAsync("User"))
                await _roleManager.CreateAsync(new IdentityRole("User"));

            if (await _roleManager.RoleExistsAsync("Admin"))
            {
                await _userManager.AddToRoleAsync(user, "Admin");
            }

            return Ok();
        }

        [HttpGet]
        [Route("list-user")]
        public async Task<IActionResult> listUsers()
        {
            var data = _context.Users.ToList();
            return Ok(data);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> getUser(string id)
        {
            var data = _context.Users.Find(id);
            return Ok(data);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var userDelete = _context.Users.Find(id);
            _context.Users.Remove(userDelete);
            _context.SaveChanges();
            return Ok();
        }
        [HttpGet("sendMail")]
        public async Task<IActionResult> SendMail(string emailUser, string Fullname)
        {

            var systemW = _context.MailConfigs.FirstOrDefault();
            var email = new MimeMessage();
            try
            {
                email.From.Add(MailboxAddress.Parse(systemW.EmailSend));
                using var smtp = new MailKit.Net.Smtp.SmtpClient();
                smtp.Connect(systemW.Server, (int)systemW.Post, SecureSocketOptions.StartTls);
                smtp.Authenticate(systemW.EmailSmtp, systemW.PassSmtp);
                try
                {
                    var text = "Cảm ơn " + Fullname + " đã đăng ký tài khoản chúng tôi";
                    email.Bcc.Add(MailboxAddress.Parse(systemW.EmailSend));
                    email.To.Add(MailboxAddress.Parse(emailUser));
                    email.Subject = /*systemW.Name + " " + "cảm ơn"*/ "Thư cảm ơn";
                    email.Body = new TextPart(TextFormat.Html) { Text = text };
                    smtp.Send(email);
                    smtp.Disconnect(true);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                    return (IActionResult)ex;
                }
            }
            catch (Exception e)
            {
                return Ok();
            }
            return Ok();
        }
        [HttpPost("ForgotPass/{username}")] 
        public async Task<IActionResult> ForgotPass(string username)
        { 
            var user = await _userManager.FindByNameAsync(username); 
            if(user!=null)
            {
                var newPass = "123456";//render ra 1 password mới
                user.PasswordHash = newPass;
                _context.Users.Update(user);
                _context.SaveChanges();
                if (await SendMailPass(newPass, user.FullName, user.Email))
                {
                    return Ok(new { status = 200 });
                }
                else
                {
                    return Ok(new { status = 400 }); // Gửi email thất bại
                } 
            }
            return Ok(new { status = 400 });
        }
         
        //gửi mail kèm theo password mới cho người dùng
        private async Task<bool> SendMailPass(string pass, string fullname, string emailUser)
        {

            var systemW = _context.MailConfigs.FirstOrDefault();
            var email = new MimeMessage();
            try
            {
                email.From.Add(MailboxAddress.Parse(systemW.EmailSend));
                using var smtp = new MailKit.Net.Smtp.SmtpClient();
                smtp.Connect(systemW.Server, (int)systemW.Post, SecureSocketOptions.StartTls);
                smtp.Authenticate(systemW.EmailSmtp, systemW.PassSmtp);
                try
                {
                    var text = "Password tài khoản của" + fullname + " là: " + pass;
                    email.Bcc.Add(MailboxAddress.Parse(systemW.EmailSend));
                    email.To.Add(MailboxAddress.Parse(emailUser));
                    email.Subject = /*systemW.Name + " " + "cảm ơn"*/ "Quên mật khẩu ";
                    email.Body = new TextPart(TextFormat.Html) { Text = text };
                    smtp.Send(email);
                    smtp.Disconnect(true);
                    return true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString()); 
                }
            }
            catch (Exception e)
            { 
            } 
            return false;
        }
        
    }

}
 
