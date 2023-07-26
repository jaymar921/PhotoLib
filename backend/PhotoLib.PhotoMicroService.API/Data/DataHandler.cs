using PhotoLib.PhotoMicroService.API.Classes;

namespace PhotoLib.PhotoMicroService.API.Data
{
    public class DataHandler
    {

        private IDictionary<Guid, PhotoDTO> _data;

        public DataHandler()
        {
            _data = new Dictionary<Guid, PhotoDTO>();
        }

        public IDictionary<Guid, PhotoDTO> GetChachedPhoto() => _data;
    }
}
