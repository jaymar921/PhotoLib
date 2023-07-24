using PhotoLib.AuthMicroService.API.Class;

namespace PhotoLib.AuthMicroService.API.Data
{
    public class SessionHandler
    {
        private LinkedList<Auth> auths;

        public SessionHandler()
        {
            auths = new LinkedList<Auth>();
        }

        public void SaveSession(Auth auth)
        {
            auths.AddLast(auth);
        }

        public Auth GetAuth(Guid Token)
        {
            return auths.FirstOrDefault(a => a.Id == Token || a.TokenID == Token) ?? new Auth(Token, Token, DateTime.Now, new TimeSpan(0,0,-1));
        }

        public void RevokeAuth(Guid guid)
        {
            auths.Remove(GetAuth(guid));
        }

        public void UpdateAuth(Guid Token, TimeSpan timeSpan)
        {
            Auth auth = GetAuth(Token);
            if (auth.TokenID == auth.Id)
                return;

            RevokeAuth(Token);
            SaveSession(new Auth(auth.Id, auth.TokenID, auth.DateIssued, timeSpan));
        }
    }
}
