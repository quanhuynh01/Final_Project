
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
using System.Security;
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
                user.LastLogin = DateTime.Now;
                _context.Update(user);
                _context.SaveChanges();
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
        public async Task<IActionResult> editUser(string id, string fullName, string userName, string email,string address)
        {
            var dataUser = _context.Users.Find(id);
            if (dataUser != null)
            {
                dataUser.FullName = fullName;
                dataUser.UserName = userName;
                dataUser.Email = email;
                dataUser.Address = address;
                _context.Users.Update(dataUser);
                _context.SaveChanges();
                Log logFile = new Log();
                logFile.NameAction = "Nguời dùng " + dataUser.Id + "(" + dataUser.FullName + ")" +"Thay đổi thông tin tài khoản";
                logFile.DescriptionAction = "";
                logFile.DateAction = DateTime.Now;
                _context.Logs.Add(logFile);
                _context.SaveChanges();
            }

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
                    var Content = " <table align=\"center\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"border-collapse:collapse\">\r\n" +
                        " <tbody>\r\n<tr>\r\n<td style=\"padding:40px 0 10px 0\">\r\n<table>\r\n<tbody>\r\n<tr>\r\n  <td>\r\n " +
                        " <img src=\"https://i.imgur.com/gNn5wKD.png\" alt=\"Creating Email Magic\" width=\"300\" height=\"auto\" style=\"display:inline-block\" " +
                        "class=\"CToWUd a6T\" data-bit=\"iit\" tabindex=\"0\"><div class=\"a6S\" dir=\"ltr\" style=\"opacity: 0.01; left: 714.984px; " +
                        "top: 307px;\"><span data-is-tooltip-wrapper=\"true\" class=\"a5q\" jsaction=\"JIbuQc:.CLIENT\">" +
                        "<button class=\"VYBDae-JX-I VYBDae-JX-I-ql-ay5-ays CgzRE\" jscontroller=\"PIVayb\" jsaction=\"click:h5M12e; clickmod:h5M12e;pointerdown:FEiYhc;pointerup:mF5Elf;pointerenter:EX0mI;pointerleave:vpvbp;pointercancel:xyn4sd;contextmenu:xexox;focus:h06R8; blur:zjh6rb;mlnRJb:fLiPzd;\" data-idom-class=\"CgzRE\" jsname=\"hRZeKc\" aria-label=\"Tải xuống tệp đính kèm \" data-tooltip-enabled=\"true\" data-tooltip-id=\"tt-c22\"" +
                        " data-tooltip-classes=\"AZPksf\" id=\"\" jslog=\"91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTc5OTAwMDY4MTE4ODYxMjI0MyJd; 43:WyJpbWFnZS9qcGVnIl0.\"><span class=\"OiePBf-zPjgPe VYBDae-JX-UHGRz\"></span><span class=\"bHC-Q\" data-unbounded=\"false\" jscontroller=\"LBaJxb\" jsname=\"m9ZlFb\" soy-skip=\"\" ssk=\"6:RWVI5c\"></span><span class=\"VYBDae-JX-ank-Rtc0Jf\" jsname=\"S5tZuc\" aria-hidden=\"true\"><span class=\"bzc-ank\"" +
                        " aria-hidden=\"true\"><svg viewBox=\"0 -960 960 960\" height=\"20\" width=\"20\" focusable=\"false\" class=\" aoH\"><path d=\"M480-336L288-528l51-51L444-474V-816h72v342L621-579l51,51L480-336ZM263.72-192Q234-192 213-213.15T192-264v-72h72v72H696v-72h72v72q0,29.7-21.16,50.85T695.96-192H263.72Z\"></path></svg></span></span><div class=\"VYBDae-JX-ano\"></div></button><div class=\"ne2Ple-oshW8e-J9\" id=\"tt-c22\" role=\"tooltip\" aria-hidden=\"true\">Tải xuống</div></span>" +
                        "</div></td>\r\n\r\n                        </tr>\r\n                        <tr>\r\n                            <td>\r\n                                <h3>Bạn đã đăng ký tài khoản tại DQ STORE!</h3>\r\n                                <p>Xin chào "+Fullname+", cảm ơn bạn đã tin tưởng DQ STORE chúc bạn có một trải nghiệm mua sắp đỉnh cao tại đây.</p>\r\n  </td></tr></tbody></table></td></tr></tbody><tbody><tr><td><br>\r\n  </td>\r\n</tr>\r\n  \r\n " +
                        "  <tr>\r\n <td bgcolor=\"#ffc107\" style=\"padding:30px 30px 30px 30px\">\r\n <table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">\r\n <tbody>\r\n  <tr>\r\n                        <td>\r\n                            <p>\r\n                                <font color=\"#ffffff\">\r\n                                    © DQ STORE<br>Địa chỉ: HIHI<br>Email:" +
                        "<a href=\"http://hello@novazone.com.vn\" target=\"_blank\" " +
                        "data-saferedirecturl=\"https://www.google.com/url?q=http://hello@novazone.com.vn&amp;source=gmail&amp;ust=1718963898920000&amp;usg=AOvVaw3yuDyLDWbJjqKL-y5904Mn\"> </a>&nbsp;quanhuynh855@gmail.com." +
                        " Điện thoại:0984855261</font></p>\r\n                        </td>\r\n                    </tr>\r\n                </tbody>\r\n            </table>\r\n        </td>\r\n    </tr>\r\n</tbody>\r\n</table>";


                    //var text = "Cảm ơn " + Fullname + " đã đăng ký tài khoản chúng tôi";
                    email.Bcc.Add(MailboxAddress.Parse(systemW.EmailSend));
                    email.To.Add(MailboxAddress.Parse(emailUser));
                    email.Subject = /*systemW.Name + " " + "cảm ơn"*/ "Thư cảm ơn";
                    email.Body = new TextPart(TextFormat.Html) { Text = Content };
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
                user.PasswordHash = Guid.NewGuid().ToString();//render ra 1 password mới
                var result = await _userManager.CreateAsync(user, user.PasswordHash);
                //user.SecurityStamp = Guid.NewGuid().ToString();
                _context.Users.Update(user);
                _context.SaveChanges();
                if (await SendMailPass(user.PasswordHash, user.FullName, user.Email))
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
 
