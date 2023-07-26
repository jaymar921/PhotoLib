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

        [HttpGet]
        public IActionResult Get()
        {
            if (!Request.Headers.TryGetValue("AuthToken", out var authToken))
                return BadRequest(new { Message = "Authentication Token is required" });

            Guid.TryParse(authToken.ToString(), out var guid);

            Auth auth = dataHandler.GetAuth(guid);

            return Ok(new {AuthToken = auth.TokenID, Expired = auth.IsExpired(), ValidDate = auth.GetExpiry(), UserRequested = auth.Username});
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
                    // check if a token exists
                    Auth auth = dataHandler.GetAuthByUser(user.Username);
                    
                    // generate token if expired
                    if(auth.IsExpired())
                    {
                        // revoke the old auth token
                        dataHandler.RevokeAuth(auth.Id);

                        // create a new auth token
                        auth = authFactory.Create(new TimeSpan(1, 0, 0));
                        auth.Username = user.Username;

                        // save session
                        dataHandler.SaveSession(auth);
                    }

                    // create authorization
                    AuthModel authorizedSession = new AuthModel { AuthToken = auth.TokenID, SessionExpiration = auth.GetExpiry(), StatusCode = 200 };

                    return Ok(authorizedSession);
                }
            };

            return Unauthorized(unauthorizedAuth);
        }
    }
}
