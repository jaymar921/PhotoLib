using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PhotoLib.AlbumMicroService.API.Data.Repository;
using PhotoLib.AlbumMicroService.API.Utility;
using PhotoLib.SystemCore.Libraries.DTO;
using PhotoLib.SystemCore.Libraries.Entity;
using PhotoLib.SystemCore.Libraries.Interfaces;

namespace PhotoLib.AlbumMicroService.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlbumController : ControllerBase
    {
        private readonly IRepository<Album> repository;

        public AlbumController(IRepository<Album> repository)
        {
            this.repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            if (!Request.Headers.TryGetValue("Username", out var username))
                return BadRequest(new { Message = "Username is missing in the request header" });

            Guid guid = await ApiHelper.ApiGetAlbumsByUsername(username.ToString());
            if (guid == Guid.Empty)
                return NotFound(new { Message = "Username specified was not found" });

            var Albums = repository.GetAlbumByUserID(guid);
            repository.IncrementAlbumViews(Albums);
            return Ok(new { Message = $"Albums found for the user '{username}'", Albums });
        }

        [HttpPost]
        public async Task<IActionResult> Post(AlbumDTO albumDTO)
        {
            var apiResult = await ApiHelper.CheckHeaderToken(Request);

            if(apiResult.StatusCode == 401)
            {
                return Unauthorized(apiResult);
            }
            if(apiResult.StatusCode == 400)
            {
                return BadRequest(apiResult);
            }

            if (!Request.Headers.TryGetValue("Username", out var username))
                return BadRequest(new { Message = "Username is missing in the request header" });

            Guid UserGuid = await ApiHelper.ApiGetAlbumsByUsername(username.ToString());
            if (UserGuid == Guid.Empty)
                return NotFound(new { Message = "Username specified was not found" });

            Guid AlbumID = Guid.NewGuid();
            Album album = new Album()
            {
                AlbumState = new AlbumState()
                {
                    DateCreated = DateTime.Now,
                    DateLastModified = DateTime.Now,
                    Guid = AlbumID,
                    Views = 0,
                    IsPublic = true,
                    Remark = "Create new album"
                },
                User = UserGuid,
                Title = albumDTO.Title,
                Description = albumDTO.Description,
                Guid = AlbumID,
            };

            repository.Add(album);
            return Ok(new {Message = "Album created"});
        }

        [HttpPut]
        public async Task<IActionResult> Update(AlbumDTO albumDTO)
        {
            var apiResult = await ApiHelper.CheckHeaderToken(Request);

            if (apiResult.StatusCode == 401)
            {
                return Unauthorized(apiResult);
            }
            if (apiResult.StatusCode == 400)
            {
                return BadRequest(apiResult);
            }

            if (!Request.Headers.TryGetValue("AlbumID", out var albumId))
                return BadRequest(new { Message = "AlbumID is missing in the request header" });

            Guid.TryParse(albumId.ToString(), out Guid albumID);

            var album = repository.Get(albumID);

            if(album.Guid == Guid.Empty)
            {
                return NotFound(new { Message = "Specified AlbumID was not found, failed to update" });
            }

            album.AlbumState.DateLastModified = DateTime.Now;
            album.Title = albumDTO.Title;
            album.Description = albumDTO.Description;
            album.AlbumState.IsPublic = albumDTO.IsPublic;
            album.AlbumState.Remark = "Update Album";

            repository.Update(album);
            return Ok(new { Message = "Album was updated" });
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(AlbumDTO albumDTO)
        {
            var apiResult = await ApiHelper.CheckHeaderToken(Request);

            if (apiResult.StatusCode == 401)
            {
                return Unauthorized(apiResult);
            }
            if (apiResult.StatusCode == 400)
            {
                return BadRequest(apiResult);
            }

            if (!Request.Headers.TryGetValue("AlbumID", out var albumId))
                return BadRequest(new { Message = "AlbumID is missing in the request header" });

            Guid.TryParse(albumId.ToString(), out Guid albumID);

            var album = repository.Get(albumID);

            if (album.Guid == Guid.Empty)
            {
                return NotFound(new { Message = "Specified AlbumID was not found, failed to update" });
            }

            repository.Delete(album);
            return Ok(new { Message = "Album was deleted" });
        }
    }
}
