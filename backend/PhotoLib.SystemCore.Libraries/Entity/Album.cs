using System.ComponentModel.DataAnnotations;

namespace PhotoLib.SystemCore.Libraries.Entity
{
    public class Album
    {
        [Key]
        public Guid Guid { get; set; }
        public User User { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public AlbumState AlbumState { get; set; }

        // Required for EF Core
        public Album() 
        {
            User = new User();
            AlbumState = new AlbumState();
        }
    }
}
