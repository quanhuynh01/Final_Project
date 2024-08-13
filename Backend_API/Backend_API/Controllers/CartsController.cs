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
    public class CartsController : ControllerBase
    {
        private readonly MiniStoredentity_Context _context;

        public CartsController(MiniStoredentity_Context context)
        {
            _context = context;
        }

        // GET: api/Carts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cart>>> GetCart()
        {
            return await _context.Cart.ToListAsync();
        }

        // GET: api/Carts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cart>> GetCart(int id)
        {
            var cart = await _context.Cart.FindAsync(id);

            if (cart == null)
            {
                return NotFound();
            }

            return cart;
        }

        // PUT: api/Carts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCart(int id, Cart cart)
        {
            if (id != cart.Id)
            {
                return BadRequest();
            }

            _context.Entry(cart).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CartExists(id))
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

        // POST: api/Carts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Cart>> PostCart(Cart cart)
        {
            _context.Cart.Add(cart);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCart", new { id = cart.Id }, cart);
        }

        // DELETE: api/Carts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCart(int id)
        {
            try
            {
                int ProductId = 0; //tạo biến ảo để lưu trữ id sản phẩm trả về
                var cart = _context.Cart.Where(c=>c.Id ==id).FirstOrDefault();
                ProductId = cart.ProductId;
                if (cart == null)
                {
                    return NotFound();
                }

                _context.Cart.Remove(cart);
                _context.SaveChanges();
                return Ok(ProductId = ProductId);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            } 
        }

        [HttpGet("getCart/{IdUser}")]
        public async Task<IActionResult> getCartByIdUser(string IdUser)
        {
            var cartItems = await _context.Cart
                                    .Include(c => c.Product)
                                    .Where(c => c.UserId == IdUser)
                                    .ToListAsync();

            foreach (var cartItem in cartItems)
            {
                var product = cartItem.Product;

                // Kiểm tra xem sản phẩm có thuộc discount hay không
                var discountPrice = _context.DiscountProducts
                                        .Where(dp => dp.ProductId == product.Id && dp.Discount.TimeEnd > DateTime.Now)
                                        .Select(dp => dp.Discount.Price)
                                        .FirstOrDefault();

                if (discountPrice != null)
                { 
                    double discountRate = discountPrice / 100.0; // Chuyển đổi thành tỷ lệ 
                    double giagiam = product.Price * discountRate; 
                    int salePrice = (int)Math.Ceiling(product.Price - giagiam); //làm tròn lên 
                    // Cập nhật lại giá giảm giá (SalePrice)
                    product.SalePrice = salePrice;
                     
                }
            }

            await _context.SaveChangesAsync(); // Lưu các thay đổi

            return Ok(cartItems);
        }



        [HttpPost("addToCart/{idUser}")]
        public async Task<IActionResult> addToCart(string idUser, int ProductId)
        {
            try
            {
                var existProduct = _context.Cart.Where(p => p.UserId == idUser && p.ProductId == ProductId).FirstOrDefault();
                if (existProduct != null)
                {
                    existProduct.Quantity += 1;
                    _context.Cart.Update(existProduct);
                    _context.SaveChanges();
                }
                else
                {
                    Cart cart = new Cart();
                    cart.UserId = idUser;
                    cart.ProductId = ProductId;
                    cart.Quantity = 1;
                    _context.Cart.Add(cart);
                    _context.SaveChanges();
                }
            }
            catch(Exception ex)
            {

            }
            
            return Ok();
        }

        [HttpPut("updateCart")]
        public async Task<IActionResult> updateCart([FromBody] List<Cart> carts)
        {
            foreach (var cart in carts)
            {
                var existingCart = _context.Cart.FirstOrDefault(c => c.Id == cart.Id);
                if (existingCart != null)
                {
                    existingCart.Quantity = cart.Quantity;
                    // Cập nhật các thuộc tính khác nếu cần
                }
            }

            await _context.SaveChangesAsync();
            return Ok();
        }
        [HttpPost("deleteCart")]
        public async Task<IActionResult> DeleteCart([FromBody] List<Cart> carts)
        {
            try
            {
                foreach (var cart in carts)
                {
                    var existingCart = _context.Cart.FirstOrDefault(c => c.Id == cart.Id);
                    if (existingCart != null)
                    {
                        _context.Cart.Remove(existingCart);
                        _context.SaveChanges();
                    }
                } 
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private bool CartExists(int id)
        {
            return _context.Cart.Any(e => e.Id == id);
        }
    }
}
