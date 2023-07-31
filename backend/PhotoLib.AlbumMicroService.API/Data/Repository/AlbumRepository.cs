using PhotoLib.SystemCore.Libraries.Entity;
using PhotoLib.SystemCore.Libraries.Interfaces;
using System.Collections.Immutable;

namespace PhotoLib.AlbumMicroService.API.Data.Repository
{
    public class AlbumRepository : IRepository<Album>
    {
        private readonly DatabaseContext _databaseContext;

        public AlbumRepository(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public bool Add(Album entity)
        {
            _databaseContext.Add(entity);
            _databaseContext.SaveChanges();
            return true;
        }

        public bool Delete(Guid guid)
        {
            var entity = Get(guid);

            if(entity.Guid == Guid.Empty)
                return false;
            _databaseContext.Remove(entity);
            _databaseContext.SaveChanges();
            return true;
        }

        public bool Delete(Album entity)
        {
            return Delete(entity.Guid);
        }

        public IReadOnlyCollection<Album> Get()
        {
            var lists = _databaseContext.Albums.ToList();
            lists.ForEach(album =>
            {
                album.AlbumState = _databaseContext.AlbumStates.First(s => s.Guid == album.Guid);
            });
            return lists;
        }

        public Album Get(Guid guid)
        {
            var album = _databaseContext.Albums.FirstOrDefault(a => a.Guid == guid) ?? new Album { Guid = Guid.Empty };
            album.AlbumState = _databaseContext.AlbumStates.FirstOrDefault(a => a.Guid == album.Guid) ?? new();
            return album;
        }

        public bool Update(Album entity)
        {
            _databaseContext.Update(entity);
            _databaseContext.SaveChanges();
            return true;
        }
    }
}
