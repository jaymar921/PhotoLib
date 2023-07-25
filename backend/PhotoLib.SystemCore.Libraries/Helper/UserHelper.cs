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
            userDTO.Socials.ToList().ForEach(userDTO => socialModels.Add(new UserSocialModel(Guid.NewGuid(), userDTO.Platform, userDTO.Link)));
            
            return new UserModel
            {
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
            List<UserSocialDTO> socialDTOs = new List<UserSocialDTO>();
            model.Socials().ToList().ForEach(social => socialDTOs.Add(new UserSocialDTO { Link = social.GetLink(), Platform = social.GetPlatform() }));
            return new UserDTO(
                    model.Firstname,
                    model.Lastname,
                    model.Bio,
                    model.Pronouns,
                    socialDTOs.ToList().ToImmutableList(),
                    model.Country,
                    model.DateCreated,
                    model.Views,
                    model.IsPublic
                );
        }
    }
}
