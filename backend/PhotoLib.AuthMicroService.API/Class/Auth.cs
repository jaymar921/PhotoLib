namespace PhotoLib.AuthMicroService.API.Class
{
    public class Auth
    {
        public Guid Id { get; private set; }
        public Guid TokenID { get; private set; }
        public DateTime DateIssued { get; private set; }
        public TimeSpan Expiry { get; private set; }
        public string Username { get; set; } = string.Empty;

        public Auth(Guid id, Guid tokenID, DateTime dateIssued, TimeSpan expiry)
        {
            Id = id;
            TokenID = tokenID;
            DateIssued = dateIssued;
            Expiry = expiry;
        }

        public bool IsExpired()
        {
            return DateTime.Now > DateIssued + Expiry;
        }

        public DateTime GetExpiry() => DateIssued + Expiry;
    }
}
