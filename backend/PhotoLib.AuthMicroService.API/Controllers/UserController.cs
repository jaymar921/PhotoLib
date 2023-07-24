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

        [HttpPut]
        public IActionResult UpdateUser(UserModel model)
        {


            if (!ModelState.IsValid)
            {
                return Ok(new { Message = "Invalid Object" });
            }

            var user = Repository.Get(model.UserID);
            // check if user exists
            if (user.Guid == Guid.Empty)
            {
                return NotFound(new { Message = "No data found" });
            }

            // rebuild the user data from the existing data

            UserBuilder userBuilder = new UserBuilder(user);
            userBuilder.SetFirstname(model.Firstname)
                .SetLastname(model.Lastname)
                .SetUsername(model.Username)
                .SetPassword(model.Password)
                .SetEmail(model.Email)
                .SetBio(model.Bio)
                .SetPronouns(model.Pronouns)
                .SetCountry(model.Country)
                .SetViews(model.Views)
                .SetIsPublic(model.IsPublic);

            user.UserState.DateLastModified = DateTime.Now;
            user.UserState.Remark = "Update Account";

            // save it to the repository
            Repository.Update(user);

            return Ok(new { Message = "Account Updated" });
        }

        [HttpDelete]
        public IActionResult DeleteUser()
        {
            bool AuthToken = Request.Headers.TryGetValue("AuthToken", out var authToken);
            bool Username = Request.Headers.TryGetValue("Username", out var username);

            if (!AuthToken)
                return Unauthorized(new { Message = "Provide an Authentication Token" });
            if (!Username)
                return Conflict(new { Message = "Please specify 'Username' at the header of the request" });

            var session = Session.GetAuth(Guid.Parse(authToken.ToString()));
            bool SessionExpired = Session.GetAuth(Guid.Parse(authToken.ToString())).IsExpired();

            if (SessionExpired)
                return Unauthorized(new { Message = "Authentication Token has been expired" });

            var UserData = Repository.GetUser(username.ToString());

            if (UserData == null)
                return NotFound(new { Message = "User not found" });

            Repository.Delete(UserData);
            return Ok(new { Message = "Account Deleted" });
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
