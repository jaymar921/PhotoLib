using PhotoLib.SystemCore.Libraries.Entity;

namespace PhotoLib.SystemCore.Libraries.Models
{
    public class UserModel
    {
        public Guid UserID { get; set; }
        public string Firstname { get; set; } = string.Empty;
        public string Lastname { get; set; } = string.Empty;
        public string Username { get; private set; } = string.Empty;
        public string Password { get; private set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public string Pronouns { get; set; } = string.Empty;
        private List<UserSocialModel> SocialsList;
        public string Country { get; set; } = string.Empty;
        public int Views { get; set; }
        public bool IsPublic { get; set; }
        public DateTime DateCreated { get; private set; }
        public DateTime DateLastModified { get; set; }
        public string Remark { get; private set; } = string.Empty;

        public UserModel(User user)
        {
            UserID = user.Guid;
            Firstname = user.UserInformation.Firstname;
            Lastname = user.UserInformation.Lastname;
            Username = user.Username;
            Password = user.Password;
            Email = user.Email;
            Bio = user.UserInformation.Bio;
            Pronouns = user.UserInformation.Pronouns;
            Country = user.UserInformation.Country;
            Views = user.UserState.Views;
            IsPublic = user.UserState.IsPublic;
            DateCreated = user.UserState.DateCreated;
            DateLastModified = user.UserState.DateLastModified;
            Remark = user.UserState.Remark;

            SocialsList = new List<UserSocialModel>();
            user.UserInformation.Socials.ToList().ForEach(
                social => SocialsList.Add(new UserSocialModel(social.Guid, social.Platform, social.Link))
            );
        }

        public UserModel()
        {
            SocialsList = new List<UserSocialModel> { };
        }

        public IEnumerable<UserSocialModel> Socials() => SocialsList;
        public UserModel SetSocials(List<UserSocialModel> socials)
        {
            SocialsList = socials;
            return this;
        }

        public UserModel SetDateCreated(DateTime dateCreated)
        {
            DateCreated = dateCreated;
            return this;
        }
    }
}
