using PhotoLib.AuthMicroService.API.Class;

namespace PhotoLib.AuthMicroService.API.Factory
{
    public class AuthFactory : IAuthFactory
    {
        public Auth Create()
        {
            return new Auth(Guid.NewGuid(), Guid.NewGuid(), DateTime.Now, new TimeSpan(0,2,0));
        }

        public Auth Create(TimeSpan expiry)
        {
            return new Auth(Guid.NewGuid(), Guid.NewGuid(), DateTime.Now, expiry);
        }
    }
}
