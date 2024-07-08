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
    public class BrandsController : ControllerBase
    {
        private readonly MiniStoredentity_Context _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public BrandsController(MiniStoredentity_Context context , IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // GET: api/Brands
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Brand>>> GetBrands()
        {
            return await _context.Brands.ToListAsync();
        }

        // GET: api/Brands/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Brand>> GetBrand(int id)
        {
            var brand = await _context.Brands.FindAsync(id);

            if (brand == null)
            {
                return NotFound();
            }

            return brand;
        }

        // PUT: api/Brands/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBrand( int id, [FromForm] Brand b)
            {
            if(id <= 0)
            {
                return BadRequest();
            }
            else
            {
                try
                {
                    var data = _context.Brands.Find(id);
                    if (data != null)
                    {
                        data.BrandName = b.BrandName; 
                        data.Active = b.Active;
                        IFormFile file = b.ImageFile;
                        if (file != null && file.Length > 0)
                        {
                            var fileName = $"{data.BrandName}{Path.GetExtension(file.FileName)}";//lưu tên file
                            var imagePath = Path.Combine(_webHostEnvironment.WebRootPath, "images", "brands");
                            if (!Directory.Exists(imagePath))
                            {
                                Directory.CreateDirectory(imagePath);
                            }
                            var uploadPath = Path.Combine(imagePath, fileName);//đường dẫn upload file
                            using (var stream = new FileStream(uploadPath, FileMode.Create))
                            {
                                await file.CopyToAsync(stream);
                            }
                            var relativePath = Path.Combine("images", "brands", fileName);
                            data.ImageBrand = "/" + relativePath.Replace("\\", "/");
                        }
                        else
                        {
                            data.ImageBrand = data.ImageBrand;
                        }
                        _context.Brands.Update(data);
                        _context.SaveChanges();
                    }
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!BrandExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            return CreatedAtAction("GetBrand", new { id = b.Id }, b);
        }

        // POST: api/Brands
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Brand>> PostBrand([FromForm] Brand b, [FromForm] List<int> CateId )
        {
            Brand brand = new Brand();
            brand.BrandName = b.BrandName;
            brand.Active = b.Active;
            IFormFile file =  b.ImageFile; 
           
            if (file != null && file.Length > 0)
            {
                var fileName = $"{ brand.BrandName}{Path.GetExtension(file.FileName)}";//lưu tên file
                var imagePath = Path.Combine(_webHostEnvironment.WebRootPath, "images", "brands");
                if (!Directory.Exists(imagePath))
                {
                    Directory.CreateDirectory(imagePath);
                } 
                var uploadPath = Path.Combine(imagePath, fileName);//đường dẫn upload file
                using (var stream = new FileStream(uploadPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                var relativePath = Path.Combine("images", "brands", fileName);
                brand.ImageBrand = "/" + relativePath.Replace("\\", "/");
            } 
            else
            {
                brand.ImageBrand = "";
            }
            if(b!=null)
            { 
                _context.Brands.Add(brand);
                _context.SaveChanges();
                if (CateId.Count > 0)
                {
                    foreach (var item in CateId)
                    {
                        CategoriesBrand br = new CategoriesBrand();
                        br.BrandId = brand.Id;
                        br.CategoryId = item;
                        _context.CategoriesBrands.Add(br);
                        _context.SaveChanges();
                    }
                }
            }
            return CreatedAtAction("GetBrand", new { id =brand.Id }, brand);
        }

        // DELETE: api/Brands/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
            {
                return NotFound();
            }

            _context.Brands.Remove(brand);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BrandExists(int id)
        {
            return _context.Brands.Any(e => e.Id == id);
        }
    }
}
