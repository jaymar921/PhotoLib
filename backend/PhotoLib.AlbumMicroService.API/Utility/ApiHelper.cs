namespace PhotoLib.AlbumMicroService.API.Utility
{
    public static class ApiHelper
    {
        public static async Task<Guid> ApiGetAlbumsByUsername(string username)
        {
            var client = new HttpClient();
            client.BaseAddress = new Uri("https://localhost:7194/");
            client.DefaultRequestHeaders.Add("Username", username);

            HttpResponseMessage httpResponseMessage = await client.GetAsync("api/User");

            var results = await httpResponseMessage.Content.ReadAsStringAsync();

            Guid.TryParse(results.TryJsonParse("userId"), out Guid Id);

            return Id;
        }


        public static async Task<ApiRequest> CheckHeaderToken(HttpRequest Request)
        {
            // check the authentication token
            if (!Request.Headers.TryGetValue("AuthToken", out var authToken))
                return new ApiRequest { Message = "Authentication Token is required", StatusCode = 400 };

            // prepare of API call [authentication token check]
            var client = new HttpClient();
            client.BaseAddress = new Uri("https://localhost:7194/");
            client.DefaultRequestHeaders.Add("AuthToken", authToken.ToString());

            // call the Auth API
            HttpResponseMessage httpResponse = await client.GetAsync("api/Auth");

            // get the result
            httpResponse.EnsureSuccessStatusCode();
            var responseResult = await httpResponse.Content.ReadAsStringAsync();

            bool.TryParse(responseResult.TryJsonParse("expired")?.ToString(), out bool AuthExpired);

            if (AuthExpired)
            {
                return new ApiRequest { Message = "Authentication Token was expired", StatusCode = 401 };
            }
            return new ApiRequest { Message = "Validated", StatusCode = 200 };
        }


        public static string TryJsonParse(this string responseResult, string key)
        {
            string[] res = responseResult.Trim()
                .Replace("{", "")
                .Replace("}", "").Split(',');
            Dictionary<string, string> data = new Dictionary<string, string>();
            foreach (string r in res)
            {
                string[] kv = r.Split(":");
                try
                {
                    data.Add(kv[0].Replace("\"", ""), kv[1].Replace("\"", ""));
                }
                catch (Exception) { }
            }

            data.TryGetValue(key, out var result);
            return result ?? "";
        }
    }
}

