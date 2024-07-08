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
    public class OrdersController : ControllerBase
    {
        private readonly MiniStoredentity_Context _context;

        public OrdersController(MiniStoredentity_Context context)
        {
            _context = context;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrder()
        {
            return await _context.Order.Include(u=>u.User).Include(d=>d.DeliveryStatus).ToListAsync();
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _context.Order.FindAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        // PUT: api/Orders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, string code)
        {
            if (id == 0)
            {
                return BadRequest();
            }
            else
            {
                var data = _context.Order.Where(o => o.Id == id).FirstOrDefault(); 
                if (data == null)
                {
                    return BadRequest(); 
                }
                else
                {
                    data.Paid = true;
                    data.Code = code;
                    data.DeliveryStatusId = 2;
                    _context.Order.Update(data);
                    _context.SaveChanges();
                    return Ok(data);
                }
            } 
        }

        // POST: api/Orders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(Order order)
        {
            _context.Order.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrder", new { id = order.Id }, order);
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Order.FindAsync(id);
            
            if (order == null)
            {
                return NotFound();
            }

            _context.Order.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        // DELETE: api/Orders/5 
        [HttpDelete("HanleDelete/{id}")]
        public async Task<IActionResult> HanleDelete(int id)
        {
            //lấy ra order deltail thuộc id order
            var lsOrderDetail =_context.OrderDetails.Where(x => x.OrderId == id).ToList();
            foreach(var item in lsOrderDetail)
            {
                var product = _context.Products.Where(p => p.Id == item.ProductId).FirstOrDefault();
                product.Stock += item.Amount;
                _context.Update(product);
                _context.SaveChanges();
            }
            var order = await _context.Order.FindAsync(id);
            _context.Order.Remove(order);
            _context.SaveChanges();
            return Ok();
        }


        [HttpPost("addOrder")]
        public async Task<IActionResult> addOrder([FromBody] Order order)
        {
            try
            {
                // Tạo đơn hàng mới
                Order o = new Order
                {
                    UserId = order.UserId,
                    DateShip = order.DateShip,
                    PhoneShip = order.PhoneShip,
                    TotalMoney = order.TotalMoney,
                    ShippingAdress = order.ShippingAdress,
                    DeliveryStatusId =1,
                    Paid = false,
                    Code= order.Code,
                };

                _context.Order.Add(o);
                _context.SaveChanges();

                if (order.OrderDetails != null && order.OrderDetails.Any())
                {
                    foreach (var item in order.OrderDetails)
                    {
                        // Kiểm tra số lượng tồn kho của sản phẩm
                        var stockProduct = _context.Products
                            .Where(p => p.Id == item.ProductId)
                            .Select(p => p.Stock)
                            .FirstOrDefault();

                        if (stockProduct < item.Amount)
                        {
                            // Nếu số lượng đặt hàng vượt quá số lượng tồn kho
                            return BadRequest(new { message = "Sản phẩm vượt quá số lượng tồn kho." });
                        }

                        // Tạo chi tiết đơn hàng
                        OrderDetail detail = new OrderDetail
                        {
                            OrderId = o.Id,
                            ProductId = item.ProductId,
                            Amount = item.Amount,
                            TotalMoney = item.TotalMoney
                        };

                        _context.OrderDetails.Add(detail);
                        _context.SaveChanges();

                        // Cập nhật số lượng tồn kho của sản phẩm sau khi đặt hàng
                        var productToUpdate = await _context.Products.FindAsync(item.ProductId);
                        productToUpdate.Stock -= item.Amount;

                        _context.Products.Update(productToUpdate);
                         _context.SaveChanges();
                    }
                }
                if (order.Carts != null && order.Carts.Any())
                {
                    foreach (var item in order.Carts)
                    {
                        // Kiểm tra xem sản phẩm đã được theo dõi trong DbContext chưa
                        var existingProduct = _context.Products.Local.FirstOrDefault(p => p.Id == item.ProductId);
                        if (existingProduct != null)
                        {
                            // Nếu đã có, sử dụng đối tượng đã được theo dõi
                            item.Product = existingProduct; 
                        }
                        else
                        {
                            // Nếu chưa có, thêm sản phẩm vào DbContext để theo dõi
                            _context.Products.Attach(item.Product);
                        }

                        // Tiến hành xóa sản phẩm từ giỏ hàng
                        _context.Cart.Remove(item);
                    } 
                    await _context.SaveChangesAsync();
                }


                return Ok(new { success = true, status = 1 ,IdOrder = o.Id}); // Đặt hàng thành công    
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi xử lý đơn hàng.", error = ex.Message });
            }
        }
         
        [HttpGet("/getOrderByUserId/{idUser}")]
        public async Task<IActionResult> getOrderByUserId(string idUser)
        {
            var order = _context.Order.Include(d=>d.DeliveryStatus).Where(o=>o.UserId == idUser).ToList();
            if (order == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(new { data = order });
            }     
        }
        [HttpGet("/orderDetailByOderId/{id}")]
        public async Task<IActionResult> orderDetailByOderId(int id)
        {
            var order = _context.OrderDetails.Include(p=>p.Product).Where(o => o.OrderId == id).ToList();
            if (order == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(new { data = order });
            }
        }

        //nhận đơn hàng
        [HttpGet("/accept/{id}")]
        public async Task<IActionResult> accept(int id)
        {
            if (id != null)
            {
                var data = _context.Order.Find(id);
                data.DeliveryStatusId = 2;
                _context.Order.Update(data);
                _context.SaveChanges();
                return Ok();
            }

            return BadRequest();
        }
        //vận chuyển đơn hàng
        [HttpGet("/deliver/{id}")]
        public async Task<IActionResult> deliver(int id)
        {
            if (id != null)
            {
                var data = _context.Order.Find(id);
                data.DeliveryStatusId = 3; 
                _context.Order.Update(data);
                _context.SaveChanges();
                return Ok();
            }

            return BadRequest();
        }
        //hủy đơn hàng
        [HttpGet("/cancelOrder/{id}")]
        public async Task<IActionResult> cancelOrder(int id)
        {
            if(id!=null)
            {
                var data = _context.Order.Find(id);
                data.DeliveryStatusId = 5;//hủy đơn
                _context.Order.Update(data);
                _context.SaveChanges();
                return Ok();
            }    
            
            return BadRequest();
        }
        //xác nhận giao đơn hàng
        [HttpGet("/AcceptDeliver/{id}")]
        public async Task<IActionResult> AcceptDeliver(int id)
        {
            if (id != null)
            {
                var data = _context.Order.Find(id);
                data.DeliveryStatusId =8;
                data.Paid = true;
                _context.Order.Update(data);
                _context.SaveChanges();
                return Ok();
            }

            return BadRequest();
        }

        //xác nhận giao đơn hàng
        [HttpGet("/trahang/{id}")]
        public async Task<IActionResult> trahang(int id)
        {
            if (id != null)
            {
                var data = _context.Order.Find(id);
                data.DeliveryStatusId = 7;
                _context.Order.Update(data);
                _context.SaveChanges();
                return Ok();
            }

            return BadRequest();
        }

        [HttpGet("/getOrderDetailByOrderId/{id}")]
        public async Task<IActionResult> getOrderDetailByOrderId(int id)
        {
            var data = _context.OrderDetails.Include(o=>o.Order).Include(p=>p.Product).Where(o => o.OrderId == id).ToList();

            return Ok(data);
        }

        private bool OrderExists(int id)
        {
            return _context.Order.Any(e => e.Id == id);
        }
    }
}
