using PhotoLib.SystemCore.Libraries.Helper;
namespace PhotoLib.SystemCore.Libraries.Tests
{
    public class ExtensionHelperTest
    {
        [Fact]
        public void Sha256Convert_ShouldReturnAString()
        {
            // Arrange
            string toHash = "I'm a string";
            Type expectedOutput = typeof(string);

            // Act
            string hashedString = toHash.Sha256Compute();

            // Assert
            Assert.IsType(expectedOutput, hashedString);
        }

        [Fact]
        public void Sha256Convert_ShouldNotReturnANullValue()
        {
            // Arrange
            string? toHash = null;

            // Act
            string? hashedString = toHash.Sha256Compute();

            // Assert
            Assert.NotNull(hashedString);
        }

        [Fact]
        public void Sha256Convert_CompareTrue()
        {
            // Arrange
            string toHash1 = "ThisIsPassword123";
            string toHash2 = "ThisIsPassword123";

            // Act
            string hashed1 = toHash1.Sha256Compute();
            string hashed2 = toHash2.Sha256Compute();

            bool output = hashed1.CompareSHA256Password(hashed2);

            // Assert
            Assert.True(output);
        }

        [Fact]
        public void MD5Convert_ShouldReturnAString()
        {
            // Arrange
            string toHash = "I'm a string";
            Type expectedOutput = typeof(string);

            // Act
            string hashedString = toHash.MD5Compute();

            // Assert
            Assert.IsType(expectedOutput, hashedString);
        }

        [Fact]
        public void MD5Convert_ShouldNotReturnANullValue()
        {
            // Arrange
            string? toHash = null;

            // Act
            string? hashedString = toHash.MD5Compute();

            // Assert
            Assert.NotNull(hashedString);
        }

        [Fact]
        public void MD5Convert_CompareTrue()
        {
            // Arrange
            string toHash1 = "ThisIsPassword123";
            string toHash2 = "ThisIsPassword123";

            // Act
            string hashed1 = toHash1.MD5Compute();
            string hashed2 = toHash2.MD5Compute();
            

            bool output = hashed1.CompareMD5Password(hashed2);

            // Assert
            Assert.True(output);
        }
    }
}
