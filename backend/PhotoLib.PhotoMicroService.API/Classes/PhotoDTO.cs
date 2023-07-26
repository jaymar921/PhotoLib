namespace PhotoLib.PhotoMicroService.API.Classes
{
    public class PhotoDTO
    {
        public Guid? PhotoId { get; set; }
        public Guid? AlbumID { get; set; } = Guid.Empty;
        public string? Caption { get; set; } = string.Empty;
        public DateTime? DateCreated { get; set; }
        public int? Views { get; set; }
    }
}
