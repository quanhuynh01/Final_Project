using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend_API.Model;
using Attribute = Backend_API.Model.Attribute;
using System.ComponentModel;
 

namespace Backend_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttributesController : ControllerBase
    {
        private readonly MiniStoredentity_Context _context;

        public AttributesController(MiniStoredentity_Context context)
        {
            _context = context;
        }

        // GET: api/Attributes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attribute>>> GetAttributes()
        {
            return await _context.Attributes.ToListAsync();
        }

        // GET: api/Attributes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Attribute>> GetAttribute(int id)
        {
            var attribute = await _context.Attributes.FindAsync(id);

            if (attribute == null)
            {
                return NotFound();
            }

            return attribute;
        }

        // PUT: api/Attributes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAttribute(int id,[FromForm] Attribute attribute, [FromForm] List<int> CateId, [FromForm]  string User)
        {
 
            var data = _context.Attributes.Find(id); 
            try
            {
                if (data != null)
                {
                    data.NameAttribute = attribute.NameAttribute;
                    //if (CateId.Count > 0 )
                    //{
                    //    foreach(var c in CateId)
                    //    {
                    //        data.CategoryId = c;
                    //    } 
                    //}
                    _context.Attributes.Update(data);
                    _context.SaveChanges();
                    Log log = new Log();
                    log.NameAction = User;
                    log.DescriptionAction ="Thay đổi thông tin thuộc tính "+ data.NameAttribute + "thành "+attribute.NameAttribute;
                    log.DateAction = DateTime.Now;
                    _context.Logs.Add(log);
                    _context.SaveChanges();
                    return Ok(); 
                }
               
            } 
            catch (Exception ex)
            {
                
            } 
            return Ok();
        }

        // POST: api/Attributes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Attribute>> PostAttribute([FromForm] Attribute attribute, [FromForm] List<int> CateId)
        {
            Attribute a = new Attribute();
            a.NameAttribute = attribute.NameAttribute;
            foreach (var item in CateId)
            {
                a.CategoryId = item;
            }
            a.Active = false;
            _context.Attributes.Add(a);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetAttribute", new { id = a.Id }, a); 
        }


        // DELETE: api/Attributes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttribute(int id)
        {
            var attribute = await _context.Attributes.FindAsync(id);
            if (attribute == null)
            {
                return NotFound();
            }
            attribute.Active = true;
            _context.Attributes.Update(attribute);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("lsfromCategories/{id}")] // Lấy view thuộc tính của sản phẩm theo danh mục đó
        public async Task<IActionResult> lsfromCategories(int id)
        {
            try
            {
                var productCategories = _context.ProductCategories
               .Where(pc => pc.ProductId == id)
               .Select(pc => pc.CategoryId)
               .ToList();

                // Tạo một danh sách để lưu trữ các thuộc tính
                var attributes = new List<Attribute>();


                foreach (var categoryId in productCategories)
                {
                    var categoryAttributes = _context.Attributes
                        .Where(a => a.CategoryId == categoryId)
                        .ToList();
                    // Thêm các thuộc tính vào danh sách attributes
                    attributes.AddRange(categoryAttributes);
                }
                return Ok(attributes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            } 
        }

        [HttpPost("GetAttributesByCategory")] // Lấy view thuộc tính của sản phẩm theo danh mục đó
        public async Task<IActionResult> GetAttributesByCategory([FromForm] List<int> CateId)
        {
            List<Attribute> attributes = new List<Attribute>();
            foreach(var item in CateId)
            {
                var data =_context.Attributes.Where(a=>a.CategoryId  == item).ToList(); 
                attributes.AddRange(data);
            }
            return Ok(attributes);
        }


            private bool AttributeExists(int id)
        {
            return _context.Attributes.Any(e => e.Id == id);
        }
    }
}
