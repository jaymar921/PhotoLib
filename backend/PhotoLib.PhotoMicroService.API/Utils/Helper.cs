namespace PhotoLib.PhotoMicroService.API.Utils
{
    public static class Helper
    {
        public static string TryJsonParse(this string responseResult, string key)
        {
            string[] res = responseResult.Trim()
                .Replace("{", "")
                .Replace("}", "").Split(',');
            Dictionary<string, string> data = new Dictionary<string, string>();
            foreach (string r in res)
            {
                string[] kv = r.Split(":");
                data.Add(kv[0].Replace("\"", ""), kv[1].Replace("\"", ""));
            }

            data.TryGetValue(key, out var result);
            return result ?? "";
        }
    }
}
