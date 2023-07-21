using System.ComponentModel.DataAnnotations;

namespace PhotoLib.SystemCore.Libraries.Entity
{
    public class UserInformation
    {
        [Key]
        public Guid Guid { get; set; }

        public string Firstname { get; set; } = string.Empty;
        public string Lastname { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public string Pronouns { get; set; } = string.Empty;
        public IEnumerable<UserSocial> Socials { get; set; }
        public string Country { get; set; } = string.Empty; 
        
        // Required for EF Core
        public UserInformation() 
        {
            Socials = new List<UserSocial>();
        }    
    }
}
