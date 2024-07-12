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
            return await _context.Products.Include(b => b.Brand).ToListAsync();
        }
        // GET: api/Products/5
        [HttpGet("/getProduct/{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            try
            {
                var productDetails = await _context.Products
                               .Where(p => p.Id == id)
                               .Select(p => new
                               {
                                   Product = p,
                                   Attributes = _context.ProductAttributes
                                                       .Where(pa => pa.ProductId == p.Id)
                                                       .Select(pa => new
                                                       {
                                                           Id = pa.Id,
                                                           NameAttribute = _context.Attributes
                                                                               .Where(a => a.Id == pa.AttributeId)
                                                                               .Select(a => a.NameAttribute)
                                                                               .FirstOrDefault(),

                                                           AttributeValue = _context.Attributevalues
                                                                               .Where(al => al.AttributeId == pa.AttributeId && al.Id ==pa.AttributeValueId)
                                                                               .Select(al => al.NameValue)
                                                                               .FirstOrDefault()
                                                       })
                                                       .ToList()
                                                       })
                                                       .FirstOrDefaultAsync(); 
                if (productDetails == null)
                {
                    return NotFound();
                }

                return Ok(productDetails);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<object>>> GetProductDetails(int id)
        {
            try
            {
                var StartNumber = _context.Review.Where(p => p.ProductId == id).Select(a => a.Rating).ToList();
                double avg = 0;
                if (StartNumber.Count <= 0)
                {
                    avg = 0;
                }
                else
                {
                    avg = Convert.ToDouble(StartNumber.Average());
                }

                var productDetails = _context.Products
                    .Where(p => p.Id == id)
                    .Select(p => new
                    {
                        Id = p.Id,
                        Sku = p.SKU,
                        ProductName = p.ProductName,
                        Price = p.Price,
                        SalePrice = p.SalePrice,
                        Avatar = p.Avatar,
                        Start = avg,
                        Description = p.Description,
                        Brand = _context.Brands.FirstOrDefault(b => b.Id == p.BrandId),
                        Attributes = _context.ProductAttributes
                                            .Where(pa => pa.ProductId == p.Id)
                                            .Select(pa => new
                                            {
                                                NameAttribute = _context.Attributes
                                                                    .Where(a => a.Id == pa.AttributeId)
                                                                    .Select(a => a.NameAttribute)
                                                                    .FirstOrDefault(),
                                                AttributeValue = _context.Attributevalues
                                                                    .Where(al => al.AttributeId == pa.AttributeId && al.Id == pa.AttributeValueId)
                                                                    .Select(al => al.NameValue)
                                                                    .FirstOrDefault()
                                            })
                                            .ToList()
                    })
                    .FirstOrDefault();
                var reviewProduct = _context.Review.Where(p => p.ProductId == id).ToList();

                if (productDetails == null)
                {
                    return NotFound();
                }

                return Ok(new { productDetails = productDetails, Reviews = reviewProduct });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, [FromForm] Product product, [FromForm] List<int> CateId)
        {
            try
            {
                if (id != null)
                {
                    var data = _context.Products.Find(id);
                    if (data != null)
                    {
                        data.ProductName = product.ProductName;
                        data.Price = product.Price;
                        data.SalePrice = product.SalePrice;
                        data.Warranty = product.Warranty;
                        data.WarrantyType = product.WarrantyType;
                        data.Active = product.Active;
                        data.BestSeller = product.BestSeller;
                        data.BrandId = product.BrandId;
                        data.Description = product.Description;
                        data.SKU = product.SKU;
                        data.Stock = product.Stock;
                        _context.Products.Update(data);
                        _context.SaveChanges();
                        if (CateId.Count > 0)
                        {
                            // Lấy danh sách danh mục hiện tại của sản phẩm
                            var currentProductCategories = _context.ProductCategories
                                .Where(pc => pc.ProductId == id)
                                .ToList();
                            if(currentProductCategories.Count >0 )
                            {
                                // Xóa các danh mục hiện tại của sản phẩm
                                _context.ProductCategories.RemoveRange(currentProductCategories);
                                await _context.SaveChangesAsync();
                            }    
                            else
                            {
                                // Thêm danh mục mới cho sản phẩm
                                foreach (var cateId in CateId)
                                {
                                    var productCategory = new ProductCategory
                                    {
                                        ProductId = id,
                                        CategoryId = cateId
                                    };
                                    _context.ProductCategories.Add(productCategory);
                                }
                                await _context.SaveChangesAsync();
                            }                             }
                        return Ok();
                    }

                }
                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
         
        }




        // POST: api/Products
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct([FromForm] Product product, [FromForm] List<IFormFile> AvatarFiles
            , [FromForm] List<int> CateId, [FromForm] List<int> AttributevalueId)
        {
            try
            {
                var codeProExist = _context.Products.Any(p => p.SKU == product.SKU);
                if (codeProExist == false)
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
                    p.Description = product.Description;
                    p.SoftDelete = false; 
                    if (p != null)
                    {
                        _context.Products.Add(p);
                        _context.SaveChanges();
                        if (p != null)
                        {
                            if (AvatarFiles != null && AvatarFiles.Count > 0)
                            {
                                var dem = 0;
                                foreach (var file in AvatarFiles)
                                {
                                    if (dem == 0)//ảnh thứ 1 làm ảnh đại diện 
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
                                        _context.SaveChanges();
                                    }
                                    if (dem >= 0)
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
                                    dem++;
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
                            if (AttributevalueId.Count > 0)
                            {
                                foreach (var item in AttributevalueId)
                                {
                                    var idThuocTinhtheogiatri = _context.Attributevalues.Where(i => i.Id == item).FirstOrDefault();
                                    ProductAttribute pa = new ProductAttribute();
                                    pa.ProductId = p.Id;
                                    pa.AttributeValueId = item;
                                    pa.AttributeId = idThuocTinhtheogiatri.AttributeId;
                                    _context.ProductAttributes.Add(pa);
                                    _context.SaveChanges();
                                }
                            }
                        }
                        return Ok(new { status = true, data = product, id = p.Id });
                    } 
                }
                else
                {
                    return Ok(new { status = false ,message = "Mã sản phẩm đã tồn tại"});
                }

            }
            catch (Exception ex)
            {

            }
            return Ok();
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                //var ProductThumb = _context.ProductThumbs.Where(p => p.ProductId == id).ToList();
                //foreach (var item in ProductThumb)
                //{
                //    _context.ProductThumbs.Remove(item);
                //    _context.SaveChangesAsync();
                //} 
                //var productAttribute = _context.ProductAttributes.Where(p => p.ProductId == id).ToList();
                //foreach (var item in productAttribute)
                //{
                //    _context.ProductAttributes.Remove(item);
                //    _context.SaveChangesAsync();
                //}
                //var ProductCategories = _context.ProductCategories.Where(p => p.ProductId == id).ToList();
                //foreach (var item in ProductCategories)
                //{
                //    _context.ProductCategories.Remove(item);
                //    _context.SaveChangesAsync();
                //}
                var product = await _context.Products.FindAsync(id);
                product.SoftDelete = true;
                _context.Products.Update(product);
                await _context.SaveChangesAsync();
                return Ok(new { id = product.Id });
            }
            catch (Exception ex)
            {

            }
            return Ok();


        }
        [HttpDelete("/deleteAtttributeProduct/{id}")]
        public async Task<IActionResult> deleteAtttributeProduct(int id)
        {
            try
            {
                var data = _context.ProductAttributes.Find(id);
                if
                    (data == null)
                {
                    return BadRequest();
                }
                else
                {
                    _context.ProductAttributes.Remove(data);
                    _context.SaveChanges();
                    return Ok();
                }
            }
            catch(Exception ex)
            {    

            }
            return Ok();
        }
        //[HttpPost("addAttribute/{idAttribute}")]
        //public async Task<IActionResult> PostProductAttribute(int id)
        //{

        //    return NoContent();
        //}


        //lấy sản phẩm theo danh mục
        [HttpGet("/danh-muc/{id}")]
        public async Task<IActionResult> GetProductsByCateId(int id)//id của Categories
        {
            try
            {
                var data = await _context.ProductCategories
                                         .Where(pc => pc.CategoryId == id && pc.Product.SoftDelete == false) // Lọc các sản phẩm thuộc danh mục có Id = id và có SoftDelete = false
                                         .Select(pc => new
                                         {
                                             Id = pc.ProductId, // Lấy Id của sản phẩm
                                             Product = _context.Products
                                                 .Where(p => p.Id == pc.ProductId && p.SoftDelete == false) // Lọc sản phẩm theo Id và SoftDelete = false
                                                 .FirstOrDefault(), // Lấy thông tin chi tiết của sản phẩm (nếu cần)
                                             Attributes = _context.ProductAttributes
                                                 .Where(pa => pa.ProductId == pc.ProductId)
                                                 .Select(pa => new
                                                 {
                                                     NameAttribute = _context.Attributes
                                                         .Where(a => a.Id == pa.AttributeId)
                                                         .Select(a => a.NameAttribute)
                                                         .FirstOrDefault(), // Lấy tên thuộc tính
                                                     AttributeValue = _context.Attributevalues
                                                         .Where(av => av.Id == pa.AttributeValueId)
                                                         .Select(av => new
                                                         {
                                                             Idvalue = av.Id,
                                                             NameValue = av.NameValue,
                                                         })
                                                         .FirstOrDefault() // Lấy giá trị của thuộc tính
                                                 })
                                                 .ToList() // Chuyển thành List các thuộc tính và giá trị tương ứng
                                         })
                                         .ToListAsync(); // Chuyển kết quả thành List và thực thi truy vấn

                var NameCate = _context.Categories.Where(c => c.Id == id).FirstOrDefault();
                var attributeValues = _context.Attributes
                                                       .Where(a => a.CategoryId == id)
                                                       .Select(a => new
                                                       {
                                                           NameAttribute = a.NameAttribute,
                                                           AttributeValues = _context.Attributevalues
                                                                                     .Where(b => b.AttributeId == a.Id)
                                                                                     .Select(a => new
                                                                                     {
                                                                                         Id = a.Id,
                                                                                         NameValue = a.NameValue
                                                                                     })
                                                                                     .ToList()
                                                                                       })
                                                                                       .ToList();
                if (data != null)
                {
                    return Ok(new { data, nameCategories = NameCate.NameCategory, AttributeValue = attributeValues });
                }
                else
                {
                    return BadRequest(new { message = "Không có dữ liệu" });
                }
            }
            catch (Exception ex)
            {

            }
            return Ok();
        }

        //tìm kiếm sản phẩm
        [HttpGet("/Search/{text}")]
        public async Task<IActionResult> searchProducts(string text)
        {
            var data = await _context.Products.Where(p => p.ProductName.Contains(text)).ToListAsync();
            if (data != null)
            {
                return Ok(data);
            }
            else
            {
                return Ok(new { message = "Không có dữ liệu" });
            }
        }
        [HttpGet("/AttributeId/{Id}")]
        public async Task<IActionResult> AttributeId(int Id)
        {

            var data = _context.ProductAttributes
                   .Include(p => p.Product)
                    .Where(p => p.AttributeValueId == Id && p.Product.SoftDelete == false)
                   .ToList();

            if (data.Count > 0)
            {
                return Ok(data);
            }
            else
            {
                return Ok(new { message = "Không có sản phẩm liên kết" });
            }
        }
        [HttpGet("/lsProduct")]
        public async Task<IActionResult> lsProduct() //ds sản phẩm có kèm theo danh mục 
        {
            var data = _context.ProductCategories.Include(p => p.Product).Include(c => c.Category).ToList();
            // Nhóm sản phẩm theo từng danh mục
            var groupedProducts = data.GroupBy(pc => pc.Category)
                .Select(group => new
                {
                    CateId= group.Key.Id,
                    CategoryName = group.Key.NameCategory,
                    Products = group.Where(p => p.Product.SoftDelete == false).Select(pc => pc.Product).ToList()
                })
                .ToList();
            return Ok(groupedProducts);
        }

        [HttpGet("lspronew")]
        public async Task<IActionResult> productNew()
        {
            var data = _context.Products.OrderBy(p=>p.DateCreate).ToList(); 
            return Ok(data);
        }

        [HttpPost("ImportExcel")]
        public async Task<IActionResult> ImportExcel([FromForm] IFormFile file)
        {

            return Ok();
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
