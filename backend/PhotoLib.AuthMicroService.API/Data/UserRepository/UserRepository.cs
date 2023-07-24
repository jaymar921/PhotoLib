using PhotoLib.SystemCore.Libraries.Entity;
using PhotoLib.SystemCore.Libraries.Interfaces;
using System;
using System.Collections.Immutable;

namespace PhotoLib.AuthMicroService.API.Data.UserRepository
{
    public class UserRepository : IRepository<User>
    {

        private readonly UserDBContext _dbContext;

        public UserRepository(UserDBContext userDBContext)
        {
            _dbContext = userDBContext;
        }

        public bool Add(User entity)
        {
            _dbContext.Users.Add(entity);
            _dbContext.UserState.Add(entity.UserState);
            _dbContext.UserInformation.Add(entity.UserInformation);
            _dbContext.SaveChanges();
            return true;
        }

        public bool Delete(Guid guid)
        {
            return Delete(Get(guid));
        }

        public bool Delete(User entity)
        {
            User user = Get(entity.Guid);

            if (user.Guid == Guid.Empty) return false;
           
            var userInfo = _dbContext.UserInformation.FirstOrDefault(u => u.Guid == user.Guid);
            var userState = _dbContext.UserState.FirstOrDefault(u => u.Guid == user.Guid);

            // remove the info and the state first
            if(userInfo != null)
                _dbContext.UserInformation.Remove(userInfo);
            if (userState != null)
                _dbContext.UserState.Remove(userState);

            // remove the actual entity
            _dbContext.Users.Remove(entity);

            _dbContext.SaveChanges();
            return true;
        }

        public IReadOnlyCollection<User> Get()
        {
            if(_dbContext.Users.Count() == 0)
                return new List<User>();

            foreach (User user in _dbContext.Users)
            {
                user.UserInformation = _dbContext.UserInformation.FirstOrDefault(u => u.Guid == user.Guid) ?? new UserInformation();
                user.UserState = _dbContext.UserState.FirstOrDefault(u => u.Guid == user.Guid) ?? new UserState();
            }
            return _dbContext.Users.ToImmutableList();
        }

        public User Get(Guid guid)
        {
            User? user = _dbContext.Users.FirstOrDefault(x => x.Guid == guid);
            if(user == null)
            {
                return new User { Guid = Guid.Empty };
            }

            user.UserInformation = _dbContext.UserInformation.First(u => u.Guid == user.Guid);
            user.UserState = _dbContext.UserState.First(u => u.Guid == user.Guid);

            return user;
        }

        public bool Update(User entity)
        {
            _dbContext.Update(entity);
            _dbContext.SaveChanges();
            return true;
        }
    }
}
