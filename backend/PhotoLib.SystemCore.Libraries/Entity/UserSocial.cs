using System.ComponentModel.DataAnnotations;

namespace PhotoLib.SystemCore.Libraries.Entity
{
    public class UserSocial
    {
        [Key]
        public Guid Guid { get; set; }
        public Guid UserID { get; set; }
        public string Platform { get; set; } = string.Empty;
        public string Link { get; set; } = string.Empty;

        // Required for EF Core
        public UserSocial() { }
    }
}
