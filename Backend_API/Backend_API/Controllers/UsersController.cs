
using Backend_API.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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
				return StatusCode(StatusCodes.Status500InternalServerError);

			User user = new User()
			{
				Email = model.Email,
				SecurityStamp = Guid.NewGuid().ToString(),
				UserName = model.Username,
                FullName = model.Fullname
			};

			var result = await _userManager.CreateAsync(user, model.Password);
			if (!result.Succeeded)
				return StatusCode(StatusCodes.Status500InternalServerError);

			return Ok();
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
            var data= _context.Users.ToList();
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
     }
}
