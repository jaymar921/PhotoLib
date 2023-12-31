﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using PhotoLib.PhotoMicroService.API.Classes;
using PhotoLib.PhotoMicroService.API.Data;
using PhotoLib.PhotoMicroService.API.Data.PhotosRepository;
using PhotoLib.PhotoMicroService.API.Utils;
using PhotoLib.SystemCore.Libraries.Entity;
using PhotoLib.SystemCore.Libraries.Interfaces;
using System.Collections.Immutable;
using PhotoDTO = PhotoLib.PhotoMicroService.API.Classes.PhotoDTO;

namespace PhotoLib.PhotoMicroService.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhotoController : ControllerBase
    {

        private readonly IRepository<Photo> repository;
        private readonly IWebHostEnvironment webHostEnvironment;
        private DataHandler CachedPhotoData;

        public PhotoController(IRepository<Photo> repository, IWebHostEnvironment webHostEnvironment, DataHandler dataHandler)
        {
            this.repository = repository;
            this.webHostEnvironment = webHostEnvironment;
            CachedPhotoData = dataHandler;
        }

        [HttpGet]
        public IActionResult Get()
        {
            /*
             * No need to check for authentication token,
             * get all photo data is available in public
             */
            if(!Request.Headers.TryGetValue("AlbumID", out var AlbumID))
            {
                return BadRequest(new {Message = "AlbumID is required in the head of the header." });
            }

            Guid.TryParse(AlbumID.ToString(), out var albumID);

            // get the photos from the album
            var photos = repository.GetPhotoDTOs(albumID);

            // update the photo views
            //repository.IncrementPhotoViews(photos);

            return Ok(new { Message = "Retrieved Photos from album specified ", Photos=photos});
        }

        [HttpGet]
        [Route("Image")]
        public async Task<IActionResult> GetImage()
        {
            /*
             * No need to check for authentication token,
             * get all photo data is available in public
             */
            if (!Request.Headers.TryGetValue("PhotoID", out var PhotoID))
            {
                return BadRequest(new { Message = "PhotoID is required in the head of the header." });
            }

            if (!Request.Headers.TryGetValue("Path", out var ImagePath))
            {
                return BadRequest(new { Message = "Path is required in the head of the header." });
            }

            Guid.TryParse(PhotoID.ToString(), out var ParsedPhotoID);
            // get the associated photo
            var photo = repository.Get(ParsedPhotoID);
            
            if(photo.Guid == Guid.Empty)
            {
                return NotFound(new { Message = "File requested does not exist." });
            }

            var path = Path.Combine(webHostEnvironment.WebRootPath, "Images", ImagePath.ToString(), photo.AlbumID.ToString());

            string[] files = Directory.GetFiles(path, "*.*", SearchOption.TopDirectoryOnly);
            string fileFound = string.Empty;
            foreach(string file in files)
            {
                if (file.Contains(photo.Guid.ToString()))
                {
                    fileFound = file;
                    break;
                }
            }

            if(string.Empty != fileFound)
            {
                path = Path.Combine(path, fileFound);

                // prepare the provider for the file send request
                var provider = new FileExtensionContentTypeProvider();
                if(!provider.TryGetContentType(path, out var contentType))
                {
                    contentType = "application/octet-stream";
                }

                // update the PhotoViews
                repository.IncrementPhotoViews(new List<PhotoDTO> 
                { 
                    new PhotoDTO
                    {
                        PhotoId = photo.Guid,
                        AlbumID = photo.AlbumID,
                        Caption = photo.Caption,
                        DateCreated = photo.DateCreated,
                        Views = photo.Views
                    }
                });

                var bytes = await System.IO.File.ReadAllBytesAsync(path);

                // send the file to the client
                return File(bytes, contentType, Path.GetFileName(path));
            }

            return NotFound(new {Message = "Image not found but meta data exists in the server's database" });
        }

        [HttpPost]
        public async Task<IActionResult> Post(PhotoDTO photo)
        {
            ApiRequest authApiResult = await AuthAPI.CheckHeaderToken(Request);

            // if statuscode == 400, return badrequest
            if(authApiResult.StatusCode == 400)
            {
                return BadRequest(authApiResult);
            }
            // if statuscode == 401, return unauthorized
            if (authApiResult.StatusCode == 401)
            {
                return Unauthorized(authApiResult);
            }

            Guid imageUID = Guid.NewGuid();

            if(null != photo.PhotoId) 
            {
                string photoId = photo.PhotoId?.ToString() ?? "";
                try
                {
                    var parsedId = Guid.Parse(photoId)!=Guid.Empty? Guid.Parse(photoId):Guid.NewGuid();
                    imageUID = parsedId;
                }catch(Exception) { /* ignore */ }
            }

            // prepare the file for upload
            CachedPhotoData.GetChachedPhoto().Add(imageUID, photo);


            return Ok(new { Message = "File Prepared for Upload", ImageID = imageUID });
        }


        [HttpPost]
        [Route("Image")]
        public async Task<IActionResult> PostImage([FromForm]IFormFile Image)
        {
            ApiRequest authApiResult = await AuthAPI.CheckHeaderToken(Request);

            // if statuscode == 400, return badrequest
            if (authApiResult.StatusCode == 400)
            {
                return BadRequest(authApiResult);
            }
            // if statuscode == 401, return unauthorized
            if (authApiResult.StatusCode == 401)
            {
                return Unauthorized(authApiResult);
            }

            if (!Request.Headers.TryGetValue("ImageID", out var ImageID))
                return BadRequest(new { Message = "ImageID is required" });

            if (!Request.Headers.TryGetValue("Path", out var ImagePath))
                return BadRequest(new { Message = "ImagePath is required" });


            Guid.TryParse(ImageID, out var ParsedImageID);

            CachedPhotoData.GetChachedPhoto().TryGetValue(ParsedImageID, out var photoDTO);

            if(photoDTO == null)
            {
                return NotFound(new { Message = "File cached data not found."});
            }

            // prepare the file
            if(Image != null)
            {
                if(Image.FileName != null && Image.FileName.Length != 0)
                {
                    // get the file extension
                    string extension = Path.GetExtension(Image.FileName);
                    // create the file path for saving
                    var savePath = Path.Combine(webHostEnvironment.WebRootPath, "Images/", $"{ImagePath}/{photoDTO.AlbumID}/{ParsedImageID}{extension}");

                    // check the directory if it exists, otherwise, create the directory
                    bool exists = Directory.Exists(Path.Combine(webHostEnvironment.WebRootPath, "Images/", $"{ImagePath}/{photoDTO.AlbumID}/"));
                    if(!exists)
                    {
                        Directory.CreateDirectory(Path.Combine(webHostEnvironment.WebRootPath, "Images/", $"{ImagePath}/{photoDTO.AlbumID}/"));
                    }

                    using(FileStream stream = new FileStream(savePath, FileMode.OpenOrCreate))
                    {
                        await Image.CopyToAsync(stream);
                        stream.Close();
                    }

                    // save the photo data into the repository/database
                    Guid.TryParse(photoDTO.AlbumID.ToString(), out var ParsedAlbumID);
                    Photo photo = new Photo
                    {
                        Guid = ParsedImageID,
                        AlbumID = ParsedAlbumID,
                        Caption = photoDTO.Caption ?? "",
                        DateCreated = DateTime.Now,
                    };
                    if(repository.Get(photo.Guid).Guid == Guid.Empty)
                        repository.Add(photo);
                }
            }

            CachedPhotoData.GetChachedPhoto().Remove(ParsedImageID);
            return Ok(new { Message = "File was uploaded "});
        }

        [HttpPatch]
        public async Task<IActionResult> Patch()
        {
            ApiRequest authApiResult = await AuthAPI.CheckHeaderToken(Request);

            // if statuscode == 400, return badrequest
            if (authApiResult.StatusCode == 400)
            {
                return BadRequest(authApiResult);
            }
            // if statuscode == 401, return unauthorized
            if (authApiResult.StatusCode == 401)
            {
                return Unauthorized(authApiResult);
            }

            if (!Request.Headers.TryGetValue("ImageID", out var ImageID))
                return BadRequest(new { Message = "ImageID is required" });

            Request.Headers.TryGetValue("Caption", out var caption);

            string captionStr = caption.ToString();

            Guid.TryParse(ImageID, out var parsedImageID);

            if (parsedImageID == Guid.Empty)
                return NotFound(new { Message = "Image Data not found" });

            var photo = repository.Get(parsedImageID);
            if(photo.Guid != Guid.Empty)
            {
                photo.Caption = captionStr;
                repository.Update(photo);
            }

            return Ok(new { Message = "Image Patched" });
        }

        [HttpDelete]
        public async Task<IActionResult> Delete()
        {
            ApiRequest authApiResult = await AuthAPI.CheckHeaderToken(Request);

            // if statuscode == 400, return badrequest
            if (authApiResult.StatusCode == 400)
            {
                return BadRequest(authApiResult);
            }
            // if statuscode == 401, return unauthorized
            if (authApiResult.StatusCode == 401)
            {
                return Unauthorized(authApiResult);
            }

            if (!Request.Headers.TryGetValue("ImageID", out var ImageID))
                return BadRequest(new { Message = "ImageID is required" });

            if (!Request.Headers.TryGetValue("Path", out var ImagePath))
                return BadRequest(new { Message = "ImagePath is required" });

            Guid.TryParse(ImageID, out var ParsedImageID);

            var photo = repository.Get(ParsedImageID);

            if (Guid.Empty == photo.Guid)
                return NotFound(new { Message = "Image was not found, failed to delete file" });

            try
            {
                var path = Path.Combine(webHostEnvironment.WebRootPath, "Images", ImagePath.ToString(), photo.AlbumID.ToString());


                string[] files = Directory.GetFiles(path, "*.*", SearchOption.TopDirectoryOnly);
                string fileFound = string.Empty;
                foreach (string file in files)
                {
                    if (file.Contains(photo.Guid.ToString()))
                    {
                        fileFound = file;
                        break;
                    }
                }

                if (string.Empty != fileFound)
                {
                    path = Path.Combine(path, fileFound);

                    if (System.IO.File.Exists(path))
                        System.IO.File.Delete(path);
                }
                repository.Delete(photo.Guid);
            }
            catch (Exception)
            {
                return NoContent();
            }
            return Ok(new { Message = "Image was deleted" });
        }
    }
}
