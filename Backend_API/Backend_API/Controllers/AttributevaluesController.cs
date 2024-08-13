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
    public class AttributevaluesController : ControllerBase
    {
        private readonly MiniStoredentity_Context _context;

        public AttributevaluesController(MiniStoredentity_Context context)
        {
            _context = context;
        }

        // GET: api/Attributevalues
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attributevalue>>> GetAttributevalues()
        {
            return await _context.Attributevalues.ToListAsync();
        }

        // GET: api/Attributevalues/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Attributevalue>> GetAttributevalue(int id)
        {
            var attributevalue = await _context.Attributevalues.FindAsync(id);

            if (attributevalue == null)
            {
                return NotFound();
            }

            return attributevalue;
        }

        // PUT: api/Attributevalues/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAttributevalue(int id, Attributevalue attributevalue)
        {
            if (id != attributevalue.Id)
            {
                return BadRequest();
            }

            _context.Entry(attributevalue).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AttributevalueExists(id))
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

        // POST: api/Attributevalues
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Attributevalue>> PostAttributevalue(Attributevalue attributevalue)
        {
            Attributevalue a = new Attributevalue();
            a.NameValue = attributevalue.NameValue;
            a.AttributeId = attributevalue.AttributeId;
            _context.Attributevalues.Add(a);
            _context.SaveChanges();
            return CreatedAtAction("GetAttributevalue", new { id = a.Id }, a);
        }

        // DELETE: api/Attributevalues/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttributevalue(int id)
        {
            var attributevalue = await _context.Attributevalues.FindAsync(id);
            var dataProduct = _context.ProductAttributes.Where(p => p.AttributeValueId == id).ToList();
            if(dataProduct.Count >0)
            {
                return Ok(new {success=false, message ="Sản phẩm đang có thuộc tính này "});
            }
            else
            {
                if (attributevalue == null)
                {
                    return NotFound();
                } 
                _context.Attributevalues.Remove(attributevalue);
                await _context.SaveChangesAsync(); 
                return Ok(new { success = true });

            }
        
        }

        [HttpGet("lsAttributeValue/{idAttr}")]
        public async Task<IActionResult> GetAttributeValuesByAttributeId(int idAttr)
        {
            try
            {
                var attributeValues = await _context.Attributevalues
                                            .Where(av => av.AttributeId == idAttr)
                                            .ToListAsync();
                if (attributeValues == null || attributeValues.Count == 0)
                {
                    return Ok(new { success = false });
                }

                return Ok(new { success = true, data = attributeValues });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }
        [HttpGet("lsAttributeAndValue/{idCategories}")]
        public async Task<IActionResult> lsAttributeAndValue(int idCategories)
        {
            // Lấy danh sách thuộc tính theo idCategories
            var attributes = await _context.Attributes
                .Where(a => a.CategoryId == idCategories)
                .ToListAsync();

            // Lấy danh sách giá trị thuộc tính theo AttributeId
            var attributeValues = await _context.Attributevalues
                .Where(av => attributes.Select(a => a.Id).Contains(av.AttributeId))
                .ToListAsync();

            // Tạo một đối tượng để trả về danh sách thuộc tính và các giá trị tương ứng
            var result = attributes.Select(attribute => new
            {   
                attribute.Id,
                attribute.NameAttribute,
                attribute.Active,
                Values = attributeValues.Where(av => av.AttributeId == attribute.Id).ToList()
            });

            return Ok(result);
        }



        [HttpPost("saveAttributeValueForProduct/{id}")]

        public async Task<IActionResult> saveAttributeValueForProduct(int id, int idPro)
        {
            try
            {
                var data =_context.ProductAttributes.Where( p=>p.AttributeValueId == id && p.ProductId == idPro).FirstOrDefault();
                if (data == null)
                {
                    var AttributeId = _context.Attributevalues.Include(a => a.Attribute).Where(a => a.Id == id).FirstOrDefault();

                    ProductAttribute pro = new ProductAttribute()
                    {
                        ProductId = idPro,
                        AttributeId = AttributeId.AttributeId,
                        AttributeValueId = AttributeId.Id
                        // Gán các thuộc tính cho p từ attributeValue nếu cần
                    };
                    _context.ProductAttributes.Add(pro);
                    _context.SaveChanges();
                    var nameAttribute = AttributeId.Attribute.NameAttribute;
                    var attributevalue = await _context.Attributevalues.FindAsync(id);

                    return Ok(new { status = 1 ,Id = pro.Id, nameAttribute = nameAttribute, nameValue = attributevalue.NameValue });
                }
                else
                {
                    return Ok(new { status = 0, message="Sản phẩm đã có thuộc tính này rồi "});
                }
               

                
            }
            catch (Exception ex)
            { 
                return BadRequest(ex.Message);
            }
           
        }

        private bool AttributevalueExists(int id)
        {
            return _context.Attributevalues.Any(e => e.Id == id);
        }
    }
}
