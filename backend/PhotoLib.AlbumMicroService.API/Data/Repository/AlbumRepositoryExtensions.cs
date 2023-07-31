using PhotoLib.SystemCore.Libraries.Entity;
using PhotoLib.SystemCore.Libraries.Interfaces;
using System.Collections.Immutable;

namespace PhotoLib.AlbumMicroService.API.Data.Repository
{
    public static class AlbumRepositoryExtensions
    {
        public static IReadOnlyCollection<Album> GetAlbumByUserID(this IRepository<Album> repository,Guid guid)
        {
            return repository.Get().Where(album => album.User == guid).ToImmutableList();
        }

        public static void IncrementAlbumViews(this IRepository<Album> repository, IReadOnlyCollection<Album> albums)
        {
            albums.ToList().ForEach(album =>
            {
                var a = repository.Get(album.Guid);
                a.AlbumState.Views++;
                repository.Update(a);
            });
        }
    }
}
