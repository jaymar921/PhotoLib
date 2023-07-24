using PhotoLib.SystemCore.Libraries.Entity;
using PhotoLib.SystemCore.Libraries.Interfaces;

namespace PhotoLib.AuthMicroService.API.Factory
{
    public class UserFactory : IFactory<User>
    {
        public User Create()
        {
            return new User() { Guid = Guid.NewGuid()};
        }
    }
}
