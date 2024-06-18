using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend_API.Model;
using NuGet.Protocol;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using System.Text.Json;

namespace Backend_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly MiniStoredentity_Context _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ProductsController(MiniStoredentity_Context context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.Include(b=>b.Brand).ToListAsync();
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = _context.Products.Include(b=>b.Brand).Where(p=>p.Id== id).FirstOrDefault();

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        // PUT: api/Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
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

        // POST: api/Products
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct([FromForm] Product product, [FromForm] List<IFormFile> AvatarFiles
            ,[FromForm] List<int> CateId)
        {   
            try
            {
                var p = new Product();
                p.ProductName = product.ProductName;
                p.SKU = product.SKU;
                p.Warranty = product.Warranty;
                p.WarrantyType = product.WarrantyType;
                p.SalePrice = product.SalePrice;
                p.Price = product.Price;
                p.Active = product.Active;
                p.BestSeller = product.BestSeller;
                p.BrandId = product.BrandId;
                p.DateCreate = DateTime.Now;
                p.Stock = product.Stock;
                if (p != null)
                { 
                    _context.Products.Add(p);
                    _context.SaveChanges();
                    if(p!=null)
                    {
                        if(AvatarFiles!=null && AvatarFiles.Count >0)
                        {
                            var dem = 0;
                            foreach (var file in AvatarFiles)
                            {   
                                if(dem ==0)//ảnh thứ 1 làm ảnh đại diện 
                                {
                                    var fileName = $"{dem}{Path.GetExtension(file.FileName)}"; 
                                    var imagePath = Path.Combine(_webHostEnvironment.WebRootPath, "images", "Product", $"{p.Id}");
                                    if (!Directory.Exists(imagePath))
                                    {
                                        Directory.CreateDirectory(imagePath);
                                    }
                                    var uploadPath = Path.Combine(imagePath, fileName);
                                    using (var stream = new FileStream(uploadPath, FileMode.Create))
                                    {
                                        await file.CopyToAsync(stream);
                                    }
                                    var relativePath = Path.Combine("images", "Product", $"{p.Id}", fileName);
                                    p.Avatar = "/" + relativePath.Replace("\\", "/");
                                    _context.Products.Update(p);
                                    _context.SaveChanges() ;
                                }
                                if(dem>0)
                                {
                                    ProductThumb pt = new ProductThumb();
                                    pt.ProductId = p.Id;
                                    var fileName = $"{dem}{Path.GetExtension(file.FileName)}";
                                    var imagePath = Path.Combine(_webHostEnvironment.WebRootPath, "images", "Product", $"{p.Id}");
                                    if (!Directory.Exists(imagePath))
                                    {
                                        Directory.CreateDirectory(imagePath);
                                    }
                                    var uploadPath = Path.Combine(imagePath, fileName);
                                    using (var stream = new FileStream(uploadPath, FileMode.Create))
                                    {
                                        await file.CopyToAsync(stream);
                                    }
                                    var relativePath = Path.Combine("images", "Product", $"{p.Id}", fileName);
                                    pt.Image = "/" + relativePath.Replace("\\", "/");
                                    _context.ProductThumbs.Add(pt);
                                    _context.SaveChanges();

                                }
                                dem ++; 
                            } 
                        } 
                        if (CateId.Count > 0)
                        {
                            foreach (var item in CateId)
                            {
                                ProductCategory pc = new ProductCategory();
                                pc.ProductId = p.Id;
                                pc.CategoryId = item;
                                _context.ProductCategories.Add(pc);
                                _context.SaveChanges();
                            }
                        }
                    }
                    return Ok(new { data = product ,id = p.Id });
                }
                else
                {
                    return NoContent();
                }
            }
            catch (Exception ex)
            {
                 
            }
            return  Ok(); 
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //[HttpPost("addAttribute/{idAttribute}")]
        //public async Task<IActionResult> PostProductAttribute(int id)
        //{

        //    return NoContent();
        //}
        [HttpPost("addToCart")]
        public async Task<IActionResult> addToCart([FromForm] string IdUser , [FromForm] Product Product)
        { 
            return NoContent();
        }

        //lấy sản phẩm theo danh mục
        [HttpGet("/danh-muc/{id}")]
        public async Task<IActionResult> GetProductsByCateId(int id)
        {
            var data = _context.ProductCategories.Include(p=>p.Product).Include(c=>c.Category).Where(p => p.CategoryId == id);
            var NameCate = _context.Categories.Where(c => c.Id == id).FirstOrDefault() ;
            if (data !=null)
            {
                return Ok( new { data, nameCategories = NameCate.NameCategory });
            }
            else
            {
                return Ok(new { message = "Không có dữ liệu" });
            } 
        }
        
        //tìm kiếm sản phẩm
        [HttpGet("/Search/{text}")]
        public async Task<IActionResult> searchProducts(string text)
        {
            var data = await _context.Products.Where(p => p.ProductName.Contains(text))  .ToListAsync();
            if (data != null)
            {
                return Ok(data);
            }
            else
            {
                return Ok(new { message = "Không có dữ liệu" });
            }
        }


        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
