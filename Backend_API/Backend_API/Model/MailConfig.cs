namespace Backend_API.Model
{
    public class MailConfig
    {
        public int Id { get; set; }

        public string Server { get; set; }

        public string EmailSend { get; set; }

        public string Name { get; set; }

        public int? Post { get; set; }

        public string EmailSmtp { get; set; }

        public string PassSmtp { get; set; }
        //1	smtp.gmail.com	0306211073@caothang.edu.vn	Quân	587	0306211073@caothang.edu.vn	oibo xege ngnc qnum
    }
}
