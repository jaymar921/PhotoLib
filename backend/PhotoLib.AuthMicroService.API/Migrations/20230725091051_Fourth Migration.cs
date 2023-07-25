using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PhotoLib.AuthMicroService.API.Migrations
{
    /// <inheritdoc />
    public partial class FourthMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserSocial_UserInformation_UserInformationGuid",
                table: "UserSocial");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserSocial",
                table: "UserSocial");

            migrationBuilder.RenameTable(
                name: "UserSocial",
                newName: "UserSocials");

            migrationBuilder.RenameIndex(
                name: "IX_UserSocial_UserInformationGuid",
                table: "UserSocials",
                newName: "IX_UserSocials_UserInformationGuid");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserSocials",
                table: "UserSocials",
                column: "Guid");

            migrationBuilder.AddForeignKey(
                name: "FK_UserSocials_UserInformation_UserInformationGuid",
                table: "UserSocials",
                column: "UserInformationGuid",
                principalTable: "UserInformation",
                principalColumn: "Guid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserSocials_UserInformation_UserInformationGuid",
                table: "UserSocials");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserSocials",
                table: "UserSocials");

            migrationBuilder.RenameTable(
                name: "UserSocials",
                newName: "UserSocial");

            migrationBuilder.RenameIndex(
                name: "IX_UserSocials_UserInformationGuid",
                table: "UserSocial",
                newName: "IX_UserSocial_UserInformationGuid");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserSocial",
                table: "UserSocial",
                column: "Guid");

            migrationBuilder.AddForeignKey(
                name: "FK_UserSocial_UserInformation_UserInformationGuid",
                table: "UserSocial",
                column: "UserInformationGuid",
                principalTable: "UserInformation",
                principalColumn: "Guid");
        }
    }
}
