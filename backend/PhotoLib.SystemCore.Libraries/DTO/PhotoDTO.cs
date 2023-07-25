namespace PhotoLib.SystemCore.Libraries.DTO
{
    public class PhotoDTO
    {
        public Guid AlbumID { get; private set; }
        public string Caption { get; private set; }
        public DateTime DateCreated { get; private set; }
        public int Views { get; private set; }

        public PhotoDTO(Guid albumID, string caption, DateTime dateCreated, int views)
        {
            AlbumID = albumID;
            Caption = caption;
            DateCreated = dateCreated;
            Views = views;
        }
    }
}
