using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PhotoLib.AuthMicroService.API.Class;
using PhotoLib.AuthMicroService.API.Data;
using PhotoLib.AuthMicroService.API.Factory;
using PhotoLib.SystemCore.Libraries.Entity;
using PhotoLib.SystemCore.Libraries.Helper;
using PhotoLib.SystemCore.Libraries.Interfaces;

namespace PhotoLib.AuthMicroService.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly SessionHandler dataHandler;
        private readonly IRepository<User> userRepository;
        private readonly IAuthFactory authFactory;

        public AuthController(SessionHandler dataHandler, IRepository<User> userRepository)
        {
            this.dataHandler = dataHandler;
            this.userRepository = userRepository;
            authFactory = new AuthFactory();
        }

        [HttpPost]
        public IActionResult Post()
        {
            Request.Headers.TryGetValue("Username", out var Username);
            Request.Headers.TryGetValue("Password", out var Password);

            AuthModel unauthorizedAuth = new AuthModel { AuthToken = Guid.Empty, SessionExpiration = DateTime.Now, StatusCode = 401 };

            if (string.IsNullOrEmpty(Username) || string.IsNullOrEmpty(Password))
                return Unauthorized(unauthorizedAuth);

            string SHA256Password = Password.ToString().Sha256Compute();
            
            // check if user exist
            foreach(User user in userRepository.Get().ToList()){
                if(user.Username == Username && user.Password.CompareSHA256Password(SHA256Password))
                {
                    // generate token
                    Auth auth = authFactory.Create();

                    // save session
                    dataHandler.SaveSession(auth);

                    // create authorization
                    AuthModel authorizedSession = new AuthModel { AuthToken = auth.TokenID, SessionExpiration = auth.GetExpiry(), StatusCode = 200 };

                    return Ok(authorizedSession);
                }
            };

            return Unauthorized(unauthorizedAuth);
        }
    }
}
