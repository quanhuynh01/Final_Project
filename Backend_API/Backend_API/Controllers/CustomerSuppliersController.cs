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

namespace Backend_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerSuppliersController : ControllerBase
    {
        private readonly MiniStoredentity_Context _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public CustomerSuppliersController(MiniStoredentity_Context context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment= webHostEnvironment;
        }

        // GET: api/CustomerSuppliers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerSupplier>>> GetCustomerSupplier()
        {
            return await _context.CustomerSupplier.ToListAsync();
        }

        // GET: api/CustomerSuppliers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerSupplier>> GetCustomerSupplier(int id)
        {
            var customerSupplier = await _context.CustomerSupplier.FindAsync(id);

            if (customerSupplier == null)
            {
                return NotFound();
            }

            return customerSupplier;
        }

        // PUT: api/CustomerSuppliers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomerSupplier(int id, CustomerSupplier customerSupplier)
        {
            if (id != customerSupplier.Id)
            {
                return BadRequest();
            }

            _context.Entry(customerSupplier).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerSupplierExists(id))
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

        // POST: api/CustomerSuppliers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CustomerSupplier>> PostCustomerSupplier([FromForm]CustomerSupplier customerSupplier)
        {
            CustomerSupplier c = new CustomerSupplier();
            c.Address = customerSupplier.Address;
            c.CompanyName = customerSupplier.CompanyName;
            c.Email = customerSupplier.Email;
            c.Phone = customerSupplier.Phone;
            c.Active = customerSupplier.Active;
            c.Level = customerSupplier.Level;
            
            IFormFile file = customerSupplier.ImageFile;
            if (file != null && file.Length > 0)
            {
                var fileName = $"{c.CompanyName}{Path.GetExtension(file.FileName)}";//lưu tên file
                var imagePath = Path.Combine(_webHostEnvironment.WebRootPath, "images", "CusSup");
                if (!Directory.Exists(imagePath))
                {
                    Directory.CreateDirectory(imagePath);
                }
                var uploadPath = Path.Combine(imagePath, fileName);//đường dẫn upload file
                using (var stream = new FileStream(uploadPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                var relativePath = Path.Combine("images", "CusSup", fileName);
                c.Image = "/" + relativePath.Replace("\\", "/");
            }
            else
            {
                c.Image = "";
            }
            if (c != null)
            { 
                _context.CustomerSupplier.Add(c);
                _context.SaveChanges();
            }  
            return CreatedAtAction("GetCustomerSupplier", new { id = customerSupplier.Id }, customerSupplier);
        } 
           
        // DELETE: api/CustomerSuppliers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomerSupplier(int id)
        {
            var customerSupplier = await _context.CustomerSupplier.FindAsync(id);
            if (customerSupplier == null)
            {
                return NotFound();
            }

            _context.CustomerSupplier.Remove(customerSupplier);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CustomerSupplierExists(int id)
        {
            return _context.CustomerSupplier.Any(e => e.Id == id);
        }
    }
}
