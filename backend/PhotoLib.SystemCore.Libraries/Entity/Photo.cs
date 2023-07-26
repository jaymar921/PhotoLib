using System.ComponentModel.DataAnnotations;

namespace PhotoLib.SystemCore.Libraries.Entity
{
    public class Photo
    {
        [Key]
        public Guid Guid { get; set; }
        public Guid AlbumID { get; set; }
        public string Caption { get; set; } = string.Empty;
        public DateTime DateCreated { get; set; }
        public int Views { get; set; }
    }
}
