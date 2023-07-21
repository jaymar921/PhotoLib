namespace PhotoLib.SystemCore.Libraries.Models
{
    public class PhotoModel
    {
        public Guid PhotoId { get; set; }
        public Guid AlbumId { get; set; }
        public string Caption { get; set; } = string.Empty;
        public DateTime DateCreated { get; set; }
        public int Views { get; set; }
    }
}
