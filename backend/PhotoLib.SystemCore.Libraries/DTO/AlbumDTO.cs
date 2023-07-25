namespace PhotoLib.SystemCore.Libraries.DTO
{
    public class AlbumDTO
    {
        public Guid UserID { get; private set; }
        public DateTime DateCreated { get; private set; }
        public DateTime DateLastModified { get; private set; }
        public string Title { get; private set; }
        public string Description { get; private set; }
        public int Views { get; private set; }
        public bool IsPublic { get; private set; }

        public AlbumDTO(Guid userID, DateTime dateCreated, DateTime dateLastModified, string title, string description, int views, bool isPublic)
        {
            UserID = userID;
            DateCreated = dateCreated;
            DateLastModified = dateLastModified;
            Title = title;
            Description = description;
            Views = views;
            IsPublic = isPublic;
        }
    }
}
