using System.ComponentModel.DataAnnotations;

namespace PhotoLib.SystemCore.Libraries.Entity
{
    public class Photo
    {
        [Key]
        public Guid Guid { get; set; }
        public Album Album { get; set; } = new Album();
        public string Caption { get; set; } = string.Empty;
        public DateTime DateCreated { get; set; }
        public int Views { get; set; }
    }
}
