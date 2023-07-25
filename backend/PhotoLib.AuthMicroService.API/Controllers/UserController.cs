using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PhotoLib.AuthMicroService.API.Builder;
using PhotoLib.AuthMicroService.API.Data;
using PhotoLib.AuthMicroService.API.Data.UserClasses;
using PhotoLib.AuthMicroService.API.Utils;
using PhotoLib.SystemCore.Libraries.DTO;
using PhotoLib.SystemCore.Libraries.Entity;
using PhotoLib.SystemCore.Libraries.Helper;
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
        public IActionResult RegisterUser(FullUserDTO model)
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

            model.Socials.ToList().ForEach(s => userBuilder.AddSocial(new UserSocial { Guid = Guid.NewGuid(), UserID = userBuilder.GetObject().Guid, Link = s.Link, Platform = s.Platform }));

            var user = userBuilder.GetObject();
            user.UserState.DateCreated = DateTime.Now;
            user.UserState.Remark = "Account Created";

            // save it to the repository
            Repository.Add(user);

            return Ok(new {Message = "Account Created"});
        }

        [HttpPut]
        public IActionResult UpdateUser(UserDTO model)
        {
            bool UsernameInHeader = Request.Headers.TryGetValue("Username", out var Username);
            bool AuthToken = Request.Headers.TryGetValue("AuthToken", out var authToken);

            if (!AuthToken)
                return Unauthorized(new { Message = "Provide an Authentication Token" });

            if (!UsernameInHeader)
                return BadRequest(new { Message = "Please specify Username at the header of the request" });

            if (!ModelState.IsValid)
            {
                return Ok(new { Message = "Invalid Object" });
            }

            var session = Session.GetAuth(Guid.Parse(authToken.ToString()));

            if (session.IsExpired())
                return Unauthorized(new { Message = "Authentication Token has been expired" });

            var user = Repository.GetUser(Username.ToString());
            // check if user exists
            if (user == null)
            {
                return NotFound(new { Message = "No data found" });
            }

            // rebuild the user data from the existing data

            List<UserSocial> userSocials = new List<UserSocial>();
            model.Socials.ToList().ForEach(s =>
            {
                userSocials.Add(new UserSocial { Link = s.Link, Platform = s.Platform });
            });

            UserBuilder userBuilder = new UserBuilder(user);
            userBuilder.SetFirstname(model.Firstname)
                .SetLastname(model.Lastname)
                .SetBio(model.Bio)
                .SetPronouns(model.Pronouns)
                .SetCountry(model.Country)
                .SetIsPublic(model.IsPublic)
                .UpdateSocial(userSocials.ToArray());

            
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

            if (session.IsExpired())
                return Unauthorized(new { Message = "Authentication Token has been expired" });

            var UserData = Repository.GetUser(username.ToString());

            if (UserData == null)
                return NotFound(new { Message = "User not found" });

            bool stat = Repository.Delete(UserData);
            return Ok(new { Message = stat?"Account Deleted":"Failed to delete account" });
        }

        [HttpPut]
        [Route("Credentials")]
        public IActionResult UpdateUserCredentials(UserCredsDTO userCredentials)
        {
            bool tokenHeader = Request.Headers.TryGetValue("AuthToken", out var token);

            if (!tokenHeader)
                return Unauthorized(new { Message = "Unauthorized, you need an AuthToken for this request. " });

            var session = Session.GetAuth(Guid.Parse(token.ToString()));

            if (session.IsExpired())
                return Unauthorized(new { Message = "Authentication Token provided has already been expired." });

            if(!ModelState.IsValid)
                return BadRequest(new {Message = "Invalid object payload. "});

            User? user = Repository.GetUser(userCredentials.UserName);

            if (user == null) return NotFound(new { Message = "Username not found." });

            user.Password = userCredentials.Password.Sha256Compute();
            if(user.Email != userCredentials.Email && !string.IsNullOrEmpty(userCredentials.Email))
                user.Email = userCredentials.Email;

            Repository.Update(user);
            return Ok(new {Message = "Account credentials was updated"});
        }

        [HttpGet]
        [Route("Credentials")]
        public IActionResult GetUserCredentials()
        {
            bool tokenHeader = Request.Headers.TryGetValue("AuthToken", out var token);
            bool usernameHeader = Request.Headers.TryGetValue("Username", out var username);

            if (!tokenHeader)
                return Unauthorized(new { Message = "Unauthorized, you need an AuthToken for this request. " });

            var session = Session.GetAuth(Guid.Parse(token.ToString()));

            if (session.IsExpired())
                return Unauthorized(new { Message = "Authentication Token provided has already been expired." });

            if (!usernameHeader)
                return BadRequest(new { Message = "Username does not exists in the header of the request" });

            User? user = Repository.GetUser(username.ToString());

            if (user == null) return NotFound(new { Message = "Username not found." });

            return Ok(new UserCredsDTO { UserName = user.Username, Password = (user.Username+user.Password).Sha256Compute(), Email = user.Email });
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

            UserBuilder userBuilder = new UserBuilder(user);
            userBuilder.IncrementViews();

            // save it to the repository
            Repository.Update(user);

            var userDTO = new UserModel(user).ParseDTO();

            return Ok(new {User= userDTO, Message = "Retrieved User info", StatusCode = 200});
        }
    }
}
