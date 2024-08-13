using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend_API.Model;
using Microsoft.AspNetCore.Hosting;

namespace Backend_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiscountsController : ControllerBase
    {
        private readonly MiniStoredentity_Context _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public DiscountsController(MiniStoredentity_Context context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // GET: api/Discounts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Discount>>> GetDiscounts()
        {
            return await _context.Discounts.ToListAsync();
        }

        // GET: api/Discounts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Discount>> GetDiscount(int id)
        {
            var discount = await _context.Discounts.FindAsync(id);

            if (discount == null)
            {
                return NotFound();
            }

            return discount;
        }

        // PUT: api/Discounts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDiscount(int id, Discount discount)
        {
            if (id != discount.Id)
            {
                return BadRequest();
            }

            _context.Entry(discount).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DiscountExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Discounts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Discount>> PostDiscount([FromForm] Discount discount)
        {
            Discount d = new Discount()
            {
                Title = discount.Title,
                Price = discount.Price,
                Show = discount.Show,
                TimeCreate = DateTime.Now,
                TimeEnd = discount.TimeEnd,
            };
            if(discount.BannerFile.Length>0&& discount.BannerFile!=null)
            {
                var fileName = $"{d.Title}{Path.GetExtension(discount.BannerFile.FileName)}";//lưu tên file
                var imagePath = Path.Combine(_webHostEnvironment.WebRootPath, "images", "discount");
                if (!Directory.Exists(imagePath))
                {
                    Directory.CreateDirectory(imagePath);
                }
                var uploadPath = Path.Combine(imagePath, fileName);//đường dẫn upload file
                using (var stream = new FileStream(uploadPath, FileMode.Create))
                {
                    await discount.BannerFile.CopyToAsync(stream);
                }
                var relativePath = Path.Combine("images", "discount", fileName);
                d.Banner = "/" + relativePath.Replace("\\", "/");
            }
            _context.Discounts.Add(d);
            _context.SaveChanges();
            return Ok(d);
        }



        [HttpPost("addProductToDiscount/{id}")]
        public async Task<IActionResult> AddProductToDiscount(int id, [FromForm] List<int> ProId)
        {
            try
            {
                foreach (var productId in ProId)
                {
                    // Kiểm tra xem sản phẩm đã có trong chiến dịch giảm giá khác và chưa hết hạn
                    var isProductInOtherDiscount = await _context.DiscountProducts
                        .AnyAsync(dp => dp.ProductId == productId && dp.Discount.TimeEnd > DateTime.Now);

                    if (isProductInOtherDiscount)
                    {
                        // Nếu sản phẩm đã có trong chiến dịch giảm giá khác và chưa hết hạn, thông báo lỗi cho client
                        var productName = await _context.Products
                            .Where(p => p.Id == productId)
                            .Select(p => p.ProductName)
                            .FirstOrDefaultAsync();

                        return Ok( new {status = 1 ,message =$"Sản phẩm {productName} đã có trong một chiến dịch giảm giá khác và chưa hết hạn." });
                    }

                    // Thêm sản phẩm vào chiến dịch giảm giá mới
                    DiscountProducts discountProducts = new DiscountProducts()
                    {
                        DiscountId = id,
                        ProductId = productId
                    };

                    _context.DiscountProducts.Add(discountProducts);
                }

                await _context.SaveChangesAsync(); // Lưu tất cả các thay đổi vào cơ sở dữ liệu

                return Ok(new { status =0, message = "Thêm thành công" }); ;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        // DELETE: api/Discounts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDiscount(int id)
        {
            var discount = await _context.Discounts.FindAsync(id);
            if (discount == null)
            {
                return NotFound();
            }

            _context.Discounts.Remove(discount);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DiscountExists(int id)
        {
            return _context.Discounts.Any(e => e.Id == id);
        }
    }
}
