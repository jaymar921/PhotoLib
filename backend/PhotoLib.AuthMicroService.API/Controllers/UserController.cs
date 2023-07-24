using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PhotoLib.AuthMicroService.API.Builder;
using PhotoLib.AuthMicroService.API.Data;
using PhotoLib.AuthMicroService.API.Utils;
using PhotoLib.SystemCore.Libraries.Entity;
using PhotoLib.SystemCore.Libraries.Interfaces;
using PhotoLib.SystemCore.Libraries.Models;

namespace PhotoLib.AuthMicroService.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly IRepository<User> Repository;
        private readonly ILogger<UserController> Logger;
        private readonly SessionHandler Session;

        public UserController(IRepository<User> repository, ILogger<UserController> logger, SessionHandler session)
        {
            Repository = repository;
            Logger = logger;
            Session = session;
        }

        [HttpPost]
        [Route("Register")]
        public IActionResult RegisterUser(UserModel model)
        {

            
            if(!ModelState.IsValid)
            {
                return Ok(new { Message = "Invalid Object" });
            }

            // check if email already Exists
            if(Repository.EmailExists(model.Email))
            {
                return Conflict(new { Message = "This email has already exists" });
            }

            // check if username already exists
            if (Repository.UsernameExists(model.Username))
            {
                return Conflict(new { Message = "This username is already taken!" });
            }

            // build the user data

            UserBuilder userBuilder = new UserBuilder();
            userBuilder.SetFirstname(model.Firstname)
                .SetLastname(model.Lastname)
                .SetUsername(model.Username)
                .SetPassword(model.Password)
                .SetEmail(model.Email)
                .SetBio(model.Bio)
                .SetPronouns(model.Pronouns)
                .SetCountry(model.Country)
                .SetViews(0)
                .SetIsPublic(model.IsPublic);

            var user = userBuilder.GetObject();
            user.UserState.DateCreated = DateTime.Now;
            user.UserState.Remark = "Account Created";

            // save it to the repository
            Repository.Add(user);

            return Ok(new {Message = "Account Created"});
        }

        [HttpGet]
        public IActionResult Get()
        {
            bool userHeader = Request.Headers.TryGetValue("Username", out var Username);
            if (!userHeader)
            {
                return BadRequest(new {Message = "Please specify 'Username' in the header", StatusCode = 400});
            }

            if(string.IsNullOrEmpty(Username))
            {
                return BadRequest(new { Message = "Please specify 'Username' in the header", StatusCode = 400 });
            }

            var user = Repository.GetUser(Username.ToString());
            if(user == null)
                return NotFound(new { Message = "Username specified was not found", StatusCode = 404 });

            return Ok(new {User=user, Message = "Retrieved User info", StatusCode = 200});
        }
    }
}
