
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

        //Generate Pass
        private string GenerateNewPassword()
        {
            // Tạo một mật khẩu mới tuân theo chính sách: ít nhất 8 ký tự, có 1 chữ hoa, 1 ký tự đặc biệt và 1 chữ số
            string upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            string lowerCase = "abcdefghijklmnopqrstuvwxyz";
            string digits = "0123456789";
            string specialChars = "!@#$%^&*()";

            Random random = new Random();

            string newPassword = new string(Enumerable.Repeat(upperCase, 1)
                .Concat(Enumerable.Repeat(lowerCase, 5))
                .Concat(Enumerable.Repeat(digits, 1))
                .Concat(Enumerable.Repeat(specialChars, 1))
                .Select(s => s[random.Next(s.Length)]).ToArray());

            // Shuffle the password to ensure randomness
            newPassword = new string(newPassword.OrderBy(c => random.Next()).ToArray());

            return newPassword;
        }

        [HttpPost("ForgotPass/{username}")]
        public async Task<IActionResult> ForgotPass(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return Ok(new { status = 400, message = "User not found." });
            }

            // Tạo mật khẩu mới
            var newPass = GenerateNewPassword(); // Sử dụng phương thức để tạo mật khẩu mới

            // Tạo mã thông báo đặt lại mật khẩu
            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

            // Đặt lại mật khẩu bằng mã thông báo
            var resetPasswordResult = await _userManager.ResetPasswordAsync(user, resetToken, newPass);
            if (!resetPasswordResult.Succeeded)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { success = false, message = "Error resetting password." });
            }

            // Gửi email cho người dùng với mật khẩu mới
            if (await SendMailPass(newPass, user.FullName, user.Email,username))
            {
                return Ok(new { status = 200, message = "Password reset successfully. Check your email for the new password." });
            }
            else
            {
                return Ok(new { status = 400, message = "Password reset successful but failed to send email." });
            }
        }

        //gửi mail kèm theo password mới cho người dùng
        private async Task<bool> SendMailPass(string pass, string fullname, string emailUser,string username)
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
                    var text = "<div class=\"textarea-pseudo\"><br> Hi <b>"+fullname+"</b>, " +
                        "<p>You recently requested to reset the password for your "+username+" \r\n  account. " +
                        "The password is: <b>"+pass+"</b></p><p>If you did not request a password reset, please ignore " +
                        "this email or reply to let us know. \r\n  </p><p>Thanks, the DQ STORE team </p><p></p></div>";
                    email.Bcc.Add(MailboxAddress.Parse(systemW.EmailSend));
                    email.To.Add(MailboxAddress.Parse(emailUser));
                    email.Subject = /*systemW.Name + " " + "cảm ơn"*/ "Forgot Password";
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
 
