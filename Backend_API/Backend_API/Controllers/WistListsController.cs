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
    public class WistListsController : ControllerBase
    {
        private readonly MiniStoredentity_Context _context;

        public WistListsController(MiniStoredentity_Context context)
        {
            _context = context;
        }

        // GET: api/WistLists
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WistList>>> GetWistLists()
        {
            return await _context.WistLists.ToListAsync();
        }

        // GET: api/WistLists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WistList>> GetWistList(int id)
        {
            var wistList = await _context.WistLists.FindAsync(id);

            if (wistList == null)
            {
                return NotFound();
            }

            return wistList;
        }

        // PUT: api/WistLists/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWistList(int id, WistList wistList)
        {
            if (id != wistList.Id)
            {
                return BadRequest();
            }

            _context.Entry(wistList).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WistListExists(id))
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

        // POST: api/WistLists
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<WistList>> PostWistList(WistList wistList)
        {
            // Kiểm tra xem đã có WistList tương ứng với IdUser và ProductId chưa
            var existingWistList = await _context.WistLists.FirstOrDefaultAsync(w => w.UserId == wistList.UserId && w.ProductId == wistList.ProductId);

            if (existingWistList != null)
            {
                 
                return Ok(new { status =200 ,message="Sản phẩm đã có trong yêu thích của bạn" });
            } 
            // Nếu chưa tồn tại, thêm WistList mới vào cơ sở dữ liệu
            _context.WistLists.Add(wistList);
            await _context.SaveChangesAsync();

            // Trả về kết quả thành công
            return Ok(new { status = 201, message = "Thêm vào yêu thích thành công" });
        }

        // DELETE: api/WistLists/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWistList(int id)
        {
            var wistList = await _context.WistLists.FindAsync(id);
            if (wistList == null)
            {
                return NotFound();
            }

            _context.WistLists.Remove(wistList);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("wistListUser/{id}")]
        public async Task<IActionResult> wistListUser(string id)
        {
            var data = _context.WistLists.Include(p=>p.Product).Where(w => w.UserId == id).ToList();
            return Ok(data);
        }

            private bool WistListExists(int id)
        {
            return _context.WistLists.Any(e => e.Id == id);
        }
    }
}
