namespace PhotoLib.AuthMicroService.API.Data.UserClasses
{
    public class UserCredsDTO
    {
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
