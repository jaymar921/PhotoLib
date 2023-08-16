using PhotoLib.SystemCore.Libraries.Entity;
using PhotoLib.SystemCore.Libraries.Interfaces;
using System.Collections.Immutable;

namespace PhotoLib.PhotoMicroService.API.Data.PhotosRepository
{
    public class PhotoRepository : IRepository<Photo>
    {

        private readonly PhotoDbContext photoDbContext;

        public PhotoRepository(PhotoDbContext photoDbContext)
        {
            this.photoDbContext = photoDbContext;
        }

        public bool Add(Photo entity)
        {
            try
            {
                photoDbContext.Photos.Add(entity);
                photoDbContext.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public bool Delete(Guid guid)
        {
            var photoObj = Get(guid);

            if (photoObj.Guid == Guid.Empty)
                return false;

            photoDbContext.Photos.Remove(photoObj);
            photoDbContext.SaveChanges();
            return true;
        }

        public bool Delete(Photo entity)
        {
            photoDbContext.Photos.Remove(entity);
            photoDbContext.SaveChanges();
            return true;
        }

        public IReadOnlyCollection<Photo> Get()
        {
            return photoDbContext.Photos.ToImmutableList();
        }

        public Photo Get(Guid guid)
        {
            var photo = photoDbContext.Photos.FirstOrDefault(p => p.Guid == guid);

            if (photo == null)
                return new Photo { Guid = Guid.Empty };

            return photo;
        }

        public bool Update(Photo entity)
        {
            try
            {
                photoDbContext.Update(entity);
                photoDbContext.SaveChanges();
            }catch (Exception)
            {
                return false;
            }
            return true;
        }
    }
}
