using Microsoft.EntityFrameworkCore;
using PhotoLib.SystemCore.Libraries.Entity;

namespace PhotoLib.AlbumMicroService.API.Data
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {

        }

        public DbSet<Album> Albums { get; set; }
        public DbSet<AlbumState> AlbumStates { get; set; }
    }
}
