using Microsoft.EntityFrameworkCore;
using PhotoLib.SystemCore.Libraries.Entity;

namespace PhotoLib.AuthMicroService.API.Data.UserRepository
{
    public class UserDBContext : DbContext
    {
        private readonly ILogger<UserDBContext> _logger;
        public UserDBContext(DbContextOptions<UserDBContext> options, ILogger<UserDBContext> logger) : base(options) 
        {
            _logger = logger;
        }

        public void Initialize()
        {
            Database.EnsureCreated();
            SaveChanges();
            _logger.LogInformation("DB Context Initialization");
        }

        public void Clear()
        {
            Users.RemoveRange(Users);
            UserInformation.RemoveRange(UserInformation);
            UserState.RemoveRange(UserState);
            SaveChanges();
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserInformation> UserInformation { get; set; }
        public DbSet<UserState> UserState { get; set; }
        public DbSet<UserSocial> UserSocials { get; set; }
    }
}
