namespace PhotoLib.SystemCore.Libraries.Models
{
    public class AlbumModel
    {
        public Guid AlbumID { get; set; }
        public Guid UserID { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateLasstModified { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Views { get; set; }
        public bool IsPublic { get; set; }
    }
}
