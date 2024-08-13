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
using System.Runtime.Intrinsics.Arm;

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
            var products = await _context.Products
         .Include(b => b.Brand)
         .Select(p => new
         {
             Id = p.Id,
             ProductName = p.ProductName,
             SKU = p.SKU,
             Avatar = p.Avatar,
             Price = p.Price,
             SalePrice = p.Price - (p.Price * (_context.DiscountProducts.Where(dp => dp.ProductId == p.Id && dp.Discount.TimeEnd > DateTime.Now).Select(dp => dp.Discount.Price).FirstOrDefault()) / 100),
             Alias = p.Alias,
             BestSeller = p.BestSeller,
             Stock = p.Stock,
             Description = p.Description,
             Warranty = p.Warranty,
             WarrantyType = p.WarrantyType,
             BrandId = p.BrandId,
             Brand = p.Brand,
             DateCreate = p.DateCreate,
             Active = p.Active,
             SoftDelete = p.SoftDelete
         })
         .ToListAsync();
            return Ok( products);
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
                var imge = _context.ProductThumbs.Where(t => t.ProductId == id).ToList();
                if (productDetails == null)
                {
                    return NotFound();
                }

                return Ok( new { productDetails = productDetails, imge = imge } );
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        //view sản phẩm chi tiết của người dùng
        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<object>>> GetProductDetails(int id)
        {
            try
            {
                var StartNumber = _context.Review.Where(p => p.ProductId == id).Select(a => a.Rating).ToList();
                double avg = 0;
                if (StartNumber.Count > 0)
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
                    SalePrice = _context.DiscountProducts
                                    .Where(dp => dp.ProductId == p.Id && dp.Discount.TimeEnd > DateTime.Now)
                                    .Select(dp => p.Price - (p.Price * dp.Discount.Price / 100))
                                    .FirstOrDefault(), // SalePrice tính theo phần trăm giảm nếu có khuyến mãi, nếu không có thì là giá gốc
                    Avatar = p.Avatar,
                    Start = avg,
                    Description = p.Description,
                    Warranty = p.Warranty,
                    WarrantyType = p.WarrantyType,
                    Brand = _context.Brands.FirstOrDefault(b => b.Id == p.BrandId),
                    Attributes = _context.ProductAttributes
                                        .Where(pa => pa.ProductId == p.Id)
                                        .GroupBy(pa => pa.AttributeId)
                                        .Select(g => new
                                        {
                                            AttributeId = g.Key,
                                            NameAttribute = _context.Attributes
                                                                    .Where(a => a.Id == g.Key)
                                                                    .Select(a => a.NameAttribute)
                                                                    .FirstOrDefault(),
                                            Values = g.Select(pa => new
                                            {
                                                AttributeValue = _context.Attributevalues
                                                                        .Where(al => al.Id == pa.AttributeValueId)
                                                                        .Select(al => al.NameValue)
                                                                        .FirstOrDefault()
                                            }).ToList()
                                        }).ToList()
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
                            if (currentProductCategories.Count > 0)
                            {
                                // Xóa các danh mục hiện tại của sản phẩm
                                _context.ProductCategories.RemoveRange(currentProductCategories);
                                await _context.SaveChangesAsync();
                            }
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
                        }
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
            , [FromForm] List<int> CateId, [FromForm] List<int> AttributevalueId , [FromForm] string User)
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
                        Log log = new Log();
                        log.NameAction = User;
                        log.DescriptionAction = "Thêm sản phẩm" + p.ProductName;
                        log.DateAction = DateTime.Now;
                        _context.Logs.Add(log);
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

                                        //luư luôn vào danh sách ảnh
                                        ProductThumb pt = new ProductThumb();
                                        pt.ProductId = p.Id;
                                        pt.IsMain = true;
                                        pt.Image = "/" + relativePath.Replace("\\", "/");
                                        _context.ProductThumbs.Add(pt);
                                        _context.SaveChanges();
                                    } 
                                    if (dem > 0)
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
                var products = await _context.ProductCategories
                    .Where(pc => pc.CategoryId == id && pc.Product.SoftDelete == false)
                    .Select(pc => new
                    {
                        Id = pc.ProductId,
                        Product = (from pro in _context.Products
                                   join dp in _context.DiscountProducts
                                   on pro.Id equals dp.ProductId into pro_dp
                                   from subProDp in pro_dp.DefaultIfEmpty()
                                   where pro.Id == pc.ProductId 
                                   select new
                                   {
                                       Id = pro.Id,
                                       Avatar = pro.Avatar,
                                       SKU = pro.SKU,
                                       ProductName = pro.ProductName,
                                       Stock = pro.Stock,
                                       Price = pro.Price,
                                       BrandId = pro.BrandId,
                                       SalePrice = subProDp != null && subProDp.Discount.TimeEnd > DateTime.Now ?
                                                            (decimal?)Math.Ceiling((double)subProDp.Discount.Price) :
                                                            null

                                   }).FirstOrDefault(),
                        Attributes = _context.ProductAttributes
                            .Where(pa => pa.ProductId == pc.ProductId)
                            .Select(pa => new
                            {
                                NameAttribute = _context.Attributes
                                    .Where(a => a.Id == pa.AttributeId)
                                    .Select(a => a.NameAttribute)
                                    .FirstOrDefault(),
                                AttributeValue = _context.Attributevalues
                                    .Where(av => av.Id == pa.AttributeValueId)
                                    .Select(av => new
                                    {
                                        Idvalue = av.Id,
                                        NameValue = av.NameValue,
                                    })
                                    .FirstOrDefault()
                            })
                            .ToList()
                    })
                    .ToListAsync();

                var category = await _context.Categories
                    .Where(c => c.Id == id)
                    .Select(c => new { c.NameCategory })
                    .FirstOrDefaultAsync();

                var attributeValues = await _context.Attributes
                    .Where(a => a.CategoryId == id)
                    .Select(a => new
                    {
                        NameAttribute = a.NameAttribute,
                        AttributeValues = _context.Attributevalues
                            .Where(av => av.AttributeId == a.Id)
                            .Select(av => new
                            {
                                Id = av.Id,
                                NameValue = av.NameValue
                            })
                            .ToList()
                    })
                    .ToListAsync();

                if (products != null && category != null)
                {
                    return Ok(new
                    {
                        data = products,
                        nameCategories = category.NameCategory,
                        AttributeValue = attributeValues
                    });
                }
                else
                {
                    return BadRequest(new { message = "Không có dữ liệu" });
                }
            }
            catch (Exception ex)
            {
                // Log exception here
                return StatusCode(500, new { message = "Internal server error" });
            }


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
        [HttpGet("/AttributeId/{Id}/{CatId}")]
        public async Task<IActionResult> AttributeId(int Id, int CatId)
        {
            try
            {
                var data = _context.ProductAttributes
                                                   .Include(pa => pa.Product)
                                                   .Where(pa => pa.AttributeValueId == Id && pa.Product.SoftDelete == false)
                                                   .ToList();

                // Lọc sản phẩm theo danh mục
                var filteredData = data
                    .Where(pa => _context.ProductCategories.Any(pc => pc.ProductId == pa.ProductId && pc.CategoryId == CatId))
                    .ToList();

                if (filteredData.Count > 0)
                {
                    return Ok(filteredData);
                }
                else
                {
                    return Ok(new { message = "Không có sản phẩm liên kết" });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }

        }
        [HttpGet("/lsProduct")]
        public async Task<IActionResult> lsProduct() //ds sản phẩm có kèm theo danh mục 
        {
            var data = _context.ProductCategories
                .Include(p => p.Product)
                .Include(c => c.Category)
                .ToList();

            // Nhóm sản phẩm theo từng danh mục
            var groupedProducts = data.GroupBy(pc => pc.Category)
                .Select(group => new
                {
                    CateId = group.Key.Id,
                    CategoryName = group.Key.NameCategory,
                    Products = group.Where(p => p.Product.SoftDelete == false).Select(pc => new
                    {
                        Id =pc.Product.Id,
                        Avatar = pc.Product.Avatar,
                        SKU = pc.Product.SKU,
                        Price = pc.Product.Price,
                        ProductId = pc.Product.Id,
                        ProductName = pc.Product.ProductName,
                        Stock = pc.Product.Stock,
                        Discount = _context.DiscountProducts
                            .Include(d => d.Discount)
                            .Where(dp => dp.ProductId == pc.Product.Id && dp.Discount.TimeEnd > DateTime.Now)
                            .Select(dp => dp.Discount.Price)
                            .FirstOrDefault(),
                        SalePrice = CalculateSalePrice(pc.Product.Price, _context.DiscountProducts
                            .Where(dp => dp.ProductId == pc.Product.Id && dp.Discount.TimeEnd > DateTime.Now)
                            .Select(dp => dp.Discount)
                            .FirstOrDefault()?.Price)
                    }).ToList()
                })
                .ToList();

            return Ok(groupedProducts);
        }

        // Hàm tính toán giá bán với giá khuyến mãi là phần trăm giảm giá
        private decimal CalculateSalePrice(decimal price, int? discountPercent)
        {
            if (discountPercent == null || discountPercent <= 0)
                return price;

            decimal discountAmount = (price * discountPercent.Value) / 100;
            return price - discountAmount;
        }

        [HttpGet("lspronew")]
        public async Task<IActionResult> productNew()
        {

            var products = await _context.Products
                                 .Include(b => b.Brand)
                                 .Select(p => new
                                 {
                                     Id = p.Id,
                                     ProductName = p.ProductName,
                                     SKU = p.SKU,
                                     Avatar = p.Avatar,
                                     Price = p.Price,
                                     SalePrice = p.Price - (p.Price * (_context.DiscountProducts.Where(dp => dp.ProductId == p.Id && dp.Discount.TimeEnd > DateTime.Now).Select(dp => dp.Discount.Price).FirstOrDefault()) / 100),
                                     Alias = p.Alias,
                                     BestSeller = p.BestSeller,
                                     Stock = p.Stock,
                                     Description = p.Description,
                                     Warranty = p.Warranty,
                                     WarrantyType = p.WarrantyType,
                                     BrandId = p.BrandId,
                                     Brand = p.Brand,
                                     DateCreate = p.DateCreate,
                                     Active = p.Active,
                                     SoftDelete = p.SoftDelete
                                 })
                                 .OrderByDescending(p=>p.DateCreate)
                                 .ToListAsync();
            return Ok(products); 
        }


        [HttpPost("addFile")]
        public async Task<IActionResult> addFile([FromForm]  int id,[FromForm] List<IFormFile> files)
        {
            try
            {
                var product = _context.Products.Find(id); // Tìm sản phẩm theo id

                if (files != null && files.Count > 0)
                {
                    List<object> uploadedImages = new List<object>(); // Danh sách để lưu thông tin các hình ảnh đã tải lên
                    int dem = 0;
                    foreach (var file in files)
                    {
                        var pt = new ProductThumb(); // Tạo một instance mới của ProductThumb
                        var exsist = _context.ProductThumbs.ToList();
                        pt.ProductId = id; // Gán ProductId cho ProductThumb
                        var fileName = $"{ exsist.Count +1  }{Path.GetExtension(file.FileName)}";
                        var imagePath = Path.Combine(_webHostEnvironment.WebRootPath, "images", "Product", $"{product.Id}");

                        if (!Directory.Exists(imagePath))
                        {
                            Directory.CreateDirectory(imagePath);
                        }

                        var uploadPath = Path.Combine(imagePath, fileName);

                        using (var stream = new FileStream(uploadPath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        var relativePath = Path.Combine("images", "Product", $"{product.Id}", fileName);
                        pt.Image = "/" + relativePath.Replace("\\", "/");
                        pt.IsMain = false;
                        _context.ProductThumbs.Add(pt); // Thêm ProductThumb vào context
                        await _context.SaveChangesAsync(); // Lưu thay đổi vào cơ sở dữ liệu
                                                         
                        uploadedImages.Add(new { Image = pt.Image });  // Thêm thông tin của hình ảnh đã tải lên vào danh sách
                        dem++;
                    }

                    return Ok(new {data = uploadedImages ,message = "Thêm hình ảnh thành công" });
                }

                return Ok(); // Trả về thành công nếu không có files được gửi lên
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message); // Trả về lỗi nếu có lỗi xảy ra
            } 
        }

        [HttpGet("getProductBrand/{id}")]
        public async Task<IActionResult> GetProductBrand(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid product ID.");
                }

                var pro = await _context.Products.FindAsync(id);
                if (pro == null)
                {
                    return NotFound("Product not found.");
                }

                var lsProBrand = await _context.Products
                    .Where(p => p.BrandId == pro.BrandId && p.Id != id) 
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(lsProBrand);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred: {ex.Message}");
            }
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
