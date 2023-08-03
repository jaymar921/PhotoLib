using Microsoft.EntityFrameworkCore;
using PhotoLib.SystemCore.Libraries.Entity;

namespace PhotoLib.PhotoMicroService.API.Data
{
    public class PhotoDbContext : DbContext
    {

        public PhotoDbContext(DbContextOptions<PhotoDbContext> options) : base(options) {
            
        }
        public void Initialize()
        {
            Database.Migrate();
            SaveChanges();
        }

        public DbSet<Photo> Photos { get;set;}
    }
}
