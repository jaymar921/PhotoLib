using Microsoft.AspNetCore.Mvc;
using PhotoLib.PhotoMicroService.API.Classes;

namespace PhotoLib.PhotoMicroService.API.Utils
{
    public class AuthAPI
    {

        public static async Task<ApiRequest> CheckHeaderToken(HttpRequest Request)
        {
            // check the authentication token
            if (!Request.Headers.TryGetValue("AuthToken", out var authToken))
                return new ApiRequest { Message = "Authentication Token is required", StatusCode = 400 };

            // prepare of API call [authentication token check]
            var client = new HttpClient();
            client.BaseAddress = new Uri("http://192.168.1.50:5051");
            client.DefaultRequestHeaders.Add("AuthToken", authToken.ToString());

            // call the Auth API
            HttpResponseMessage httpResponse = await client.GetAsync("api/Auth");

            // get the result
            httpResponse.EnsureSuccessStatusCode();
            var responseResult = await httpResponse.Content.ReadAsStringAsync();

            bool.TryParse(responseResult.TryJsonParse("expired")?.ToString(), out bool AuthExpired);

            if (AuthExpired)
            {
                return new ApiRequest{ Message = "Authentication Token was expired", StatusCode = 401 };
            }
            return new ApiRequest { Message = "Validated", StatusCode = 200};
        }
    }
}
