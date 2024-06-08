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
        public async Task<ActionResult<Attributevalue>> PostAttributevalue( Attributevalue attributevalue)
        {
            Attributevalue a= new Attributevalue();
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
            if (attributevalue == null)
            {
                return NotFound();
            }

            _context.Attributevalues.Remove(attributevalue);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("lsAttributeValue/{idAttr}")]
        public async Task<IActionResult> GetAttributeValuesByAttributeId(int idAttr)
        {
            var attributeValues = await _context.Attributevalues
                                            .Where(av => av.AttributeId == idAttr)
                                            .ToListAsync();
            if (attributeValues == null || attributeValues.Count == 0)
            {
                return NotFound();
            }

            return Ok(attributeValues);
        }




        private bool AttributevalueExists(int id)
        {
            return _context.Attributevalues.Any(e => e.Id == id);
        }
    }
}
