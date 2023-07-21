using System.Security.Cryptography;
using System.Text;

namespace PhotoLib.SystemCore.Libraries.Helper
{
    public static class ExtensionHelper
    {
        public static string Sha256Compute(this string? str)
        {
            str ??= string.Empty;
            using (var sha256 = SHA256.Create())
            {
                byte[] hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(str));
                return Convert.ToBase64String(hash);
            }
        }

        public static string MD5Compute(this string? str)
        {
            str ??= string.Empty;
            using (var md5 = SHA256.Create())
            {
                byte[] hash = md5.ComputeHash(Encoding.UTF8.GetBytes(str));
                return BitConverter.ToString(hash).Replace("-","");
            }
        }

        public static bool CompareSHA256Password(this string str, string password)
        {
            return str == password;
        }

        public static bool CompareMD5Password(this string str, string password) 
        {
            return str == password;
        }
    }
}
