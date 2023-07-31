using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PhotoLib.AlbumMicroService.API.Migrations
{
    /// <inheritdoc />
    public partial class Migration1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Albums_AlbumState_AlbumStateGuid",
                table: "Albums");

            migrationBuilder.DropForeignKey(
                name: "FK_Albums_User_UserGuid",
                table: "Albums");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "UserSocial");

            migrationBuilder.DropTable(
                name: "UserState");

            migrationBuilder.DropTable(
                name: "UserInformation");

            migrationBuilder.DropIndex(
                name: "IX_Albums_UserGuid",
                table: "Albums");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AlbumState",
                table: "AlbumState");

            migrationBuilder.RenameTable(
                name: "AlbumState",
                newName: "AlbumStates");

            migrationBuilder.RenameColumn(
                name: "UserGuid",
                table: "Albums",
                newName: "User");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AlbumStates",
                table: "AlbumStates",
                column: "Guid");

            migrationBuilder.AddForeignKey(
                name: "FK_Albums_AlbumStates_AlbumStateGuid",
                table: "Albums",
                column: "AlbumStateGuid",
                principalTable: "AlbumStates",
                principalColumn: "Guid",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Albums_AlbumStates_AlbumStateGuid",
                table: "Albums");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AlbumStates",
                table: "AlbumStates");

            migrationBuilder.RenameTable(
                name: "AlbumStates",
                newName: "AlbumState");

            migrationBuilder.RenameColumn(
                name: "User",
                table: "Albums",
                newName: "UserGuid");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AlbumState",
                table: "AlbumState",
                column: "Guid");

            migrationBuilder.CreateTable(
                name: "UserInformation",
                columns: table => new
                {
                    Guid = table.Column<Guid>(type: "TEXT", nullable: false),
                    Bio = table.Column<string>(type: "TEXT", nullable: false),
                    Country = table.Column<string>(type: "TEXT", nullable: false),
                    Firstname = table.Column<string>(type: "TEXT", nullable: false),
                    Lastname = table.Column<string>(type: "TEXT", nullable: false),
                    Pronouns = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserInformation", x => x.Guid);
                });

            migrationBuilder.CreateTable(
                name: "UserState",
                columns: table => new
                {
                    Guid = table.Column<Guid>(type: "TEXT", nullable: false),
                    DateCreated = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DateLastModified = table.Column<DateTime>(type: "TEXT", nullable: false),
                    IsPublic = table.Column<bool>(type: "INTEGER", nullable: false),
                    Remark = table.Column<string>(type: "TEXT", nullable: false),
                    Views = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserState", x => x.Guid);
                });

            migrationBuilder.CreateTable(
                name: "UserSocial",
                columns: table => new
                {
                    Guid = table.Column<Guid>(type: "TEXT", nullable: false),
                    Link = table.Column<string>(type: "TEXT", nullable: false),
                    Platform = table.Column<string>(type: "TEXT", nullable: false),
                    UserID = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserInformationGuid = table.Column<Guid>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSocial", x => x.Guid);
                    table.ForeignKey(
                        name: "FK_UserSocial_UserInformation_UserInformationGuid",
                        column: x => x.UserInformationGuid,
                        principalTable: "UserInformation",
                        principalColumn: "Guid");
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Guid = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserInformationGuid = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserStateGuid = table.Column<Guid>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Password = table.Column<string>(type: "TEXT", nullable: false),
                    Username = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Guid);
                    table.ForeignKey(
                        name: "FK_User_UserInformation_UserInformationGuid",
                        column: x => x.UserInformationGuid,
                        principalTable: "UserInformation",
                        principalColumn: "Guid",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_User_UserState_UserStateGuid",
                        column: x => x.UserStateGuid,
                        principalTable: "UserState",
                        principalColumn: "Guid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Albums_UserGuid",
                table: "Albums",
                column: "UserGuid");

            migrationBuilder.CreateIndex(
                name: "IX_User_UserInformationGuid",
                table: "User",
                column: "UserInformationGuid");

            migrationBuilder.CreateIndex(
                name: "IX_User_UserStateGuid",
                table: "User",
                column: "UserStateGuid");

            migrationBuilder.CreateIndex(
                name: "IX_UserSocial_UserInformationGuid",
                table: "UserSocial",
                column: "UserInformationGuid");

            migrationBuilder.AddForeignKey(
                name: "FK_Albums_AlbumState_AlbumStateGuid",
                table: "Albums",
                column: "AlbumStateGuid",
                principalTable: "AlbumState",
                principalColumn: "Guid",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Albums_User_UserGuid",
                table: "Albums",
                column: "UserGuid",
                principalTable: "User",
                principalColumn: "Guid",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
