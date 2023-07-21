namespace PhotoLib.SystemCore.Libraries.Models
{
    public class UserSocialModel
    {
        private Guid SocialID;
        private string Platform;
        private string Link;

        public UserSocialModel(Guid socialID, string platform, string link)
        {
            SocialID = socialID;
            Platform = platform;
            Link = link;
        }

        public Guid GetSocialID() => SocialID;
        public string GetPlatform() => Platform;
        public string GetLink() => Link;
    }
}