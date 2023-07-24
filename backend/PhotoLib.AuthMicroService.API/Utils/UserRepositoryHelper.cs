using PhotoLib.SystemCore.Libraries.Entity;
using PhotoLib.SystemCore.Libraries.Interfaces;

namespace PhotoLib.AuthMicroService.API.Utils
{
    public static class UserRepositoryHelper
    {
        public static bool EmailExists(this IRepository<User> repository, string Email)
        {
            foreach(var user in repository.Get())
            {
                if(user.Email == Email)
                    return true;
            }
            return false;
        }

        public static bool UsernameExists(this IRepository<User> repository, string Username)
        {
            foreach (var user in repository.Get())
            {
                if (user.Username == Username)
                    return true;
            }
            return false;
        }

        public static User? GetUser(this IRepository<User> repository, string Username)
        {
            foreach (var user in repository.Get())
            {
                if (user.Username == Username)
                    return user;
            }
            return null;
        }
    }
}
