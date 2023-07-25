using PhotoLib.SystemCore.Libraries.DTO;
using PhotoLib.SystemCore.Libraries.Models;

namespace PhotoLib.AuthMicroService.API.Data.UserClasses
{
    public class FullUserDTO : UserDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public FullUserDTO(string Username, string Password, string Email, string firstname, string lastname, string bio, string pronouns, IReadOnlyCollection<UserSocialDTO> socials, string country, DateTime dateCreated, int views, bool isPublic) : base(firstname, lastname, bio, pronouns, socials, country, dateCreated, views, isPublic)
        {
            this.Username = Username;
            this.Password = Password;
            this.Email = Email;
        }
    }
}
