using PhotoLib.PhotoMicroService.API.Classes;
using PhotoLib.SystemCore.Libraries.Entity;
using PhotoLib.SystemCore.Libraries.Interfaces;
using System.Collections.Immutable;

namespace PhotoLib.PhotoMicroService.API.Data.PhotosRepository
{
    public static class PhotoRepositoryExtensions
    {

        public static IReadOnlyCollection<PhotoDTO> GetPhotoDTOs(this IRepository<Photo> repository, Guid albumID)
        {
            List<PhotoDTO> photos = new List<PhotoDTO>();

            repository.Get().Where(p => p.AlbumID == albumID).ToList().ForEach(p =>
            {
                photos.Add(new PhotoDTO
                {
                    PhotoId = p.Guid,
                    AlbumID = albumID,
                    Caption = p.Caption,
                    DateCreated = p.DateCreated,
                    Views = p.Views,
                });
            });
            return photos;
        } 

        public static void IncrementPhotoViews(this IRepository<Photo> repository, IReadOnlyCollection<PhotoDTO> photos)
        {
            photos.ToImmutableList().ForEach(item =>
            {
                var photo = repository.Get(item.PhotoId ?? Guid.Empty);
                if (photo != null)
                {
                    photo.Views += 1;
                    repository.Update(photo);
                }
            });
        }
    }
}
