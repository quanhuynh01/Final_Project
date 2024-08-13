
using Backend_API.Model;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using StackExchange.Redis;
using CodeMegaVNPay.Services;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<MiniStoredentity_Context>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("MiniStoredentity_Context") ?? throw new InvalidOperationException("Connection string 'MiniStoredentity_Context' not found.")));


// Add services to the container.

//config cho identity
builder.Services.AddIdentity<User, IdentityRole>()
                 .AddEntityFrameworkStores<MiniStoredentity_Context>()
                .AddDefaultTokenProviders();
//config cho Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
 //config google
 .AddGoogle(googleOptions =>
 {
     googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"];
     googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
     googleOptions.CallbackPath = "/signin-google";
 })

//config cho jwt
.AddJwtBearer(options =>
{
    options.SaveToken=true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:ValidAudience"],
        ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
    };  
});

builder.Services.AddControllers();
//config CORS
builder.Services.AddCors(option =>
{
    option.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod(); 
    });
});

//config VNPAY 
builder.Services.AddScoped<IVnPayService, VnPayService>();

//config Redis  

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors();
app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAuthorization();

app.UseAuthentication();



app.MapControllers();

app.Run();
