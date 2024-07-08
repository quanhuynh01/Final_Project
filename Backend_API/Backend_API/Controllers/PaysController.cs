using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend_API.Model;
using CodeMegaVNPay.Services;
using CodeMegaVNPay.Models;

namespace Backend_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaysController : Controller 
    {
        private readonly MiniStoredentity_Context _context;
        private readonly IVnPayService _vnPayService;
        public PaysController(MiniStoredentity_Context context , IVnPayService vnPayService )
        {
            _context = context;
            _vnPayService = vnPayService;
        } 

        //pay
        [HttpPost]
        public IActionResult CreatePaymentUrl(PaymentInformationModel model)
        {
            var url = _vnPayService.CreatePaymentUrl(model, HttpContext); 
            return Ok(url);
        }

        [HttpGet]
        public IActionResult PaymentCallback()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);

            return Ok(response);
        }

        private bool PayExists(int id)
        {
            return _context.Pay.Any(e => e.Id == id);
        }
    }
}
