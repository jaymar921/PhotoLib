using PhotoLib.SystemCore.Libraries.DTO;
using PhotoLib.SystemCore.Libraries.Models;

namespace PhotoLib.SystemCore.Libraries.Helper
{
    public static class PhotoHelper
    {
        public static PhotoModel ParseModel(this PhotoDTO photoDTO)
        {
            return new PhotoModel()
            {
                AlbumId = photoDTO.AlbumID,
                Caption = photoDTO.Caption,
                DateCreated = photoDTO.DateCreated,
                Views = photoDTO.Views
            };
        }

        public static PhotoDTO ParseDTO(this PhotoModel model)
        {
            return new PhotoDTO(model.AlbumId, model.Caption, model.DateCreated, model.Views);
        }
    }
}
