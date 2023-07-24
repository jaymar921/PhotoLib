using PhotoLib.AuthMicroService.API.Class;

namespace PhotoLib.AuthMicroService.API.Factory
{
    public interface IAuthFactory
    {
        public Auth Create();
        public Auth Create(TimeSpan expiry);
    }
}
