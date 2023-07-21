using System.ComponentModel.DataAnnotations;

namespace PhotoLib.SystemCore.Libraries.Entity
{
    public class UserState
    {
        [Key]
        public Guid Guid { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateLastModified { get; set; }
        public string Remark { get; set; } = string.Empty;
        public int Views { get; set; }
        public bool IsPublic { get; set; }

        // Required for EF Core
        public UserState(){ }
    }
}
