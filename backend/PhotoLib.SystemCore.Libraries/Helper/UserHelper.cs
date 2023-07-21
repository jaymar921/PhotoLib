using PhotoLib.SystemCore.Libraries.DTO;
using PhotoLib.SystemCore.Libraries.Models;
using System.Collections.Immutable;

namespace PhotoLib.SystemCore.Libraries.Helper
{
    public static class UserHelper
    {
        public static UserModel ParseModel(this UserDTO userDTO)
        {
            List<UserSocialModel> socialModels = new List<UserSocialModel>();
            userDTO.Socials.ToList().ForEach(userDTO => socialModels.Add(userDTO));
            
            return new UserModel
            {
                UserID = userDTO.UserID,
                Firstname = userDTO.Firstname,
                Lastname = userDTO.Lastname,
                Bio = userDTO.Bio,
                Pronouns = userDTO.Pronouns,
                Country = userDTO.Country,
                Views = userDTO.Views,
                IsPublic = userDTO.IsPublic
            }
            .SetDateCreated(userDTO.DateCreated)
            .SetSocials(socialModels);
        }

        public static UserDTO ParseDTO(this UserModel model)
        {
            return new UserDTO(
                    model.UserID,
                    model.Firstname,
                    model.Firstname,
                    model.Bio,
                    model.Pronouns,
                    model.Socials().ToImmutableList(),
                    model.Country,
                    model.DateCreated,
                    model.Views,
                    model.IsPublic
                );
        }
    }
}
