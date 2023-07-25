using PhotoLib.SystemCore.Libraries.DTO;
using PhotoLib.SystemCore.Libraries.Models;

namespace PhotoLib.SystemCore.Libraries.Helper
{
    public static class AlbumHelper
    {
        public static AlbumModel ParseModel(this AlbumDTO albumDTO)
        {
            return new AlbumModel
            {
                UserID = albumDTO.UserID,
                DateCreated = albumDTO.DateCreated,
                DateLasstModified = albumDTO.DateLastModified,
                Title = albumDTO.Title,
                Description = albumDTO.Description,
                Views = albumDTO.Views,
                IsPublic = albumDTO.IsPublic,
            };
        }

        public static AlbumDTO ParseDTO(this AlbumModel model)
        {
            return new AlbumDTO(model.UserID, model.DateCreated, model.DateLasstModified, model.Title, model.Description, model.Views, model.IsPublic);
        }
    }
}
