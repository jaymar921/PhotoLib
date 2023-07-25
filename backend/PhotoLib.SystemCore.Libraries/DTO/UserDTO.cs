using PhotoLib.SystemCore.Libraries.Models;

namespace PhotoLib.SystemCore.Libraries.DTO
{
    public class UserDTO
    {
        public string Firstname { get; private set; }
        public string Lastname { get; private set; }
        public string Bio { get; private set; }
        public string Pronouns { get; private set; }
        public IReadOnlyCollection<UserSocialDTO> Socials { get; private set; }
        public string Country { get; private set; }
        public DateTime DateCreated { get; private set; }
        public int Views { get; private set; }
        public bool IsPublic { get; private set; }

        public UserDTO(string firstname, string lastname, string bio, string pronouns, IReadOnlyCollection<UserSocialDTO> socials, string country, DateTime dateCreated, int views, bool isPublic)
        {
            Firstname = firstname;
            Lastname = lastname;
            Bio = bio;
            Pronouns = pronouns;
            Socials = socials;
            Country = country;
            DateCreated = dateCreated;
            Views = views;
            IsPublic = isPublic;
        }
    }
}
