namespace PhotoLib.AuthMicroService.API.Class
{
    public class AuthModel
    {
        public Guid AuthToken { get; set; }
        public DateTime SessionExpiration { get; set; }
        public int StatusCode { get; set; }
    }
}
