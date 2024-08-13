using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend_API.Model;

namespace Backend_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductThumbsController : ControllerBase
    {
        private readonly MiniStoredentity_Context _context;

        public ProductThumbsController(MiniStoredentity_Context context)
        {
            _context = context;
        }

        // GET: api/ProductThumbs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductThumb>>> GetProductThumbs()
        {
            return await _context.ProductThumbs.ToListAsync();
        }

        // GET: api/ProductThumbs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductThumb>> GetProductThumb(int id)
        {
            var productThumb = await _context.ProductThumbs.FindAsync(id);

            if (productThumb == null)
            {
                return NotFound();
            }

            return productThumb;
        }

        // PUT: api/ProductThumbs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductThumb(int id, ProductThumb productThumb)
        {
            if (id != productThumb.Id)
            {
                return BadRequest();
            }

            _context.Entry(productThumb).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductThumbExists(id))
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

        // POST: api/ProductThumbs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProductThumb>> PostProductThumb(ProductThumb productThumb)
        {
            _context.ProductThumbs.Add(productThumb);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProductThumb", new { id = productThumb.Id }, productThumb);
        }

        // DELETE: api/ProductThumbs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductThumb(int id)
        {
            var productThumb = await _context.ProductThumbs.FindAsync(id);
            if (productThumb == null)
            {
                return NotFound();
            }

            // Xác định đường dẫn đầy đủ của tệp hình ảnh
            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", productThumb.Image.TrimStart('/'));

            // Xóa tệp hình ảnh khỏi thư mục lưu trữ
            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }

            _context.ProductThumbs.Remove(productThumb);
            await _context.SaveChangesAsync(); 
            return NoContent();
        }


        [HttpPut("setMain/{id}")]
        public async Task<IActionResult> setMain(int id , int proId)
        {
            var productThumb = _context.ProductThumbs.Where(p => p.ProductId == proId).ToList();
            var product = _context.Products.Find(proId);
            var p = new ProductThumb();
            foreach(var item in productThumb)
            {
                if(item.Id== id)
                {
                    item.IsMain = true;
                    p = item;
                    product.Avatar = item.Image;
                    _context.Products.Update(product);
                    _context.SaveChanges();
                }
                else
                {
                    item.IsMain = false;
                }
                _context.ProductThumbs.Update(item);
            } 
             
            //cho tất cả hình ảnh về lại false  
            _context.SaveChanges(); 
            return Ok(p);
        }


        [HttpGet("hinhsp/{id}")]
        public async Task<IActionResult> GetHinhSanPham(int id)
        {
            var productThumb = _context.ProductThumbs.Where(s => s.ProductId == id).ToList() ;
            if (productThumb == null)
            {
                return NotFound();
            } 
            return Ok(productThumb);
        }




        private bool ProductThumbExists(int id)
        {
            return _context.ProductThumbs.Any(e => e.Id == id);
        }
    }
}
