using System.ComponentModel.DataAnnotations.Schema;

namespace Backend_API.Model
{
    public class Order
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public string Orderer { get; set; }
        public string ShippingAdress { get; set; }
        public string PhoneShip { get; set; }
        public DateTime DateShip { get; set; }
        public int TotalMoney { get; set; }
        [NotMapped]
        public List<OrderDetail> OrderDetails { get; set; }
        [NotMapped]
        public List<Cart> Carts { get; set; }  
        public int DeliveryStatusId { get; set; }
        public DeliveryStatus DeliveryStatus { get; set; }

        public bool Paid { get; set; }

    }
}
