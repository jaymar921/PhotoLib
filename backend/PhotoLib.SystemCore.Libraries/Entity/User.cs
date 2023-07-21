using System.ComponentModel.DataAnnotations;

namespace PhotoLib.SystemCore.Libraries.Entity
{
    public class User
    {
        [Key]
        public Guid Guid { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public UserInformation UserInformation { get; set; }
        public UserState UserState { get; set; }

        // Required for EF Core
        public User() 
        {
            UserInformation = new UserInformation();
            UserState = new UserState();
        }
    }
}
