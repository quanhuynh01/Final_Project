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

            _context.ProductThumbs.Remove(productThumb);
            await _context.SaveChangesAsync();

            return NoContent();
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
