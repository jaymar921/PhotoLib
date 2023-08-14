using PhotoLib.AuthMicroService.API.Factory;
using PhotoLib.SystemCore.Libraries.Entity;
using PhotoLib.SystemCore.Libraries.Helper;

namespace PhotoLib.AuthMicroService.API.Builder
{
    public class UserBuilder
    {
        private User User;

        public UserBuilder(User user) 
        {
            User = user;
        }
        
        public UserBuilder()
        {
            User = new UserFactory().Create();
        }

        public User Build()
        {
            User = new UserFactory().Create();
            return User;
        }

        public UserBuilder SetFirstname(string Firstname)
        {
            User.UserInformation.Firstname = Firstname;
            return this;
        }

        public UserBuilder SetLastname(string Lastname)
        {
            User.UserInformation.Lastname = Lastname;
            return this;
        }

        public UserBuilder SetUsername(string Username)
        {
            User.Username = Username;
            return this;
        }

        /// <summary>
        /// Set the password of the User object, automatically Hash the password argument into SHA256
        /// </summary>
        /// <param name="Password"></param>
        /// <returns></returns>
        public UserBuilder SetPassword(string Password)
        {
            User.Password = Password.Sha256Compute();
            return this;
        }


        public UserBuilder SetEmail(string Email)
        {
            User.Email = Email;
            return this;
        }

        public UserBuilder SetBio(string Bio)
        {
            User.UserInformation.Bio = Bio;
            return this;
        }

        public UserBuilder SetPronouns(string Pronouns)
        {
            User.UserInformation.Pronouns = Pronouns;
            return this;
        }

        public UserBuilder AddSocial(UserSocial social)
        {
            social.UserID = User.Guid;
            social.Guid = Guid.NewGuid();

            List<UserSocial> socialsList = (List<UserSocial>)User.UserInformation.Socials;
            socialsList.Add(social);

            User.UserInformation.Socials = socialsList;
            return this;
        }

        public UserBuilder UpdateSocial(params UserSocial[] socials)
        {
            var userSocialsDt = User.UserInformation.Socials;
            if(socials.Length > 0)
            {
                User.UserInformation.Socials = new List<UserSocial>();
                foreach (UserSocial social in socials)
                {
                    
                    AddSocial(social);
                    
                }
            }
            else
            {
                User.UserInformation.Socials = new List<UserSocial>();
            }
            
            return this;
        }

        public UserBuilder SetSocial(List<UserSocial> socials)
        {
            User.UserInformation.Socials = socials;

            return this;
        }

        public UserBuilder RemoveSocial(UserSocial social)
        {
            UserSocial? s = User.UserInformation.Socials.FirstOrDefault(x => x.Guid == social.Guid);
            if (s != null)
            {
                User.UserInformation.Socials.ToList().Remove(s);
            }
            return this;
        }

        public UserBuilder SetCountry(string Country)
        {
            User.UserInformation.Country = Country;
            return this;
        }

        public UserBuilder SetViews(int n)
        {
            User.UserState.Views = n;
            return this;
        }

        public UserBuilder IncrementViews()
        {
            User.UserState.Views++;
            return this;
        }

        public UserBuilder SetIsPublic(bool isPublic)
        {
            User.UserState.IsPublic = isPublic;
            return this;
        }

        public User GetObject()
        {
            Guid userid = User.Guid;
            User.UserInformation.Guid = userid;
            User.UserState.Guid = userid;
            return User;
        }
    }
}
