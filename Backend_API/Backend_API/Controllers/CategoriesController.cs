using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend_API.Model;
using Microsoft.AspNetCore.Hosting;
using System.Drawing.Drawing2D;
using System.Text.Json.Nodes;

namespace Backend_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly MiniStoredentity_Context _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public CategoriesController(MiniStoredentity_Context context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            return await _context.Categories.ToListAsync();
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        // PUT: api/Categories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory([FromForm] int id, [FromForm] Category category)
        {
            if (id != category.Id)
            {
                return BadRequest();
            }
             
            try
            {
                var data = _context.Categories.Find(id);
                if (data == null)
                {
                    return NotFound();
                }
                else
                {
                    data.NameCategory= category.NameCategory;
                    data.Description= category.Description;
                    data.Show  = category.Show;

                    if (category.ImageCateFile  ==null)
                    {
                        _context.Categories.Update(data);
                        _context.SaveChanges();
                        return Ok();
                    }
                    else
                    {
                        IFormFile file = category.ImageCateFile;
                        if (file != null)
                        {
                            var fileName = $"{data.NameCategory}{Path.GetExtension(file.FileName)}";//lưu tên file
                            var imagePath = Path.Combine(_webHostEnvironment.WebRootPath, "images", "categories");
                            if (!Directory.Exists(imagePath))
                            {
                                Directory.CreateDirectory(imagePath);
                            }
                            var uploadPath = Path.Combine(imagePath, fileName);//đường dẫn upload file
                            using (var stream = new FileStream(uploadPath, FileMode.Create))
                            {
                                await file.CopyToAsync(stream);
                            }
                            var relativePath = Path.Combine("images", "categories", fileName);
                            data.IconCate = "/" + relativePath.Replace("\\", "/");
                            _context.Categories.Update(data);
                            _context.SaveChanges();
                            return Ok();
                        } 
                    }
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
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

        // POST: api/Categories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory([FromForm]Category category)
        {
            Category c= new Category();
            c.NameCategory = category.NameCategory;
            c.Description = category.Description;
            c.Show = category.Show;
            c.DayCreate= DateTime.Now;
            IFormFile file = category.ImageCateFile;
            if (file != null && file.Length > 0)
            {
                var fileName = $"{c.NameCategory}{Path.GetExtension(file.FileName)}";//lưu tên file
                var imagePath = Path.Combine(_webHostEnvironment.WebRootPath, "images", "categories");
                if (!Directory.Exists(imagePath))
                {
                    Directory.CreateDirectory(imagePath);
                }
                var uploadPath = Path.Combine(imagePath, fileName);//đường dẫn upload file
                using (var stream = new FileStream(uploadPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                var relativePath = Path.Combine("images", "categories", fileName);
                c.IconCate = "/" + relativePath.Replace("\\", "/");
            }
            else
            {
                c.IconCate =  "";
            }



            _context.Categories.Add(c);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCategory", new { id = category.Id }, category);
        }

        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("/categoriresBrand")]
        public async Task<ActionResult<IEnumerable<CategoriesBrand>>> categoriresBrand()
        {
            var data = _context.CategoriesBrands.Include(b => b.Brand).Include(c => c.Category).ToList();
            return data;
        } 
            private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }
    }
}
