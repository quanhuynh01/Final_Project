namespace Backend_API.Model
{
    public class Order
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public string ShippingAdress { get; set; }
        public string PhoneShip { get; set; }
        public DateTime DateShip { get; set; }
        public int TotalMoney { get; set; }
    }
}
