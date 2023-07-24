using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PhotoLib.AuthMicroService.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserInformation",
                columns: table => new
                {
                    Guid = table.Column<Guid>(type: "TEXT", nullable: false),
                    Firstname = table.Column<string>(type: "TEXT", nullable: false),
                    Lastname = table.Column<string>(type: "TEXT", nullable: false),
                    Bio = table.Column<string>(type: "TEXT", nullable: false),
                    Pronouns = table.Column<string>(type: "TEXT", nullable: false),
                    Country = table.Column<string>(type: "TEXT", nullable: false)
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
                    Remark = table.Column<string>(type: "TEXT", nullable: false),
                    Views = table.Column<int>(type: "INTEGER", nullable: false),
                    IsPublic = table.Column<bool>(type: "INTEGER", nullable: false)
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
                    Platform = table.Column<string>(type: "TEXT", nullable: false),
                    Link = table.Column<string>(type: "TEXT", nullable: false),
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
                name: "Users",
                columns: table => new
                {
                    Guid = table.Column<Guid>(type: "TEXT", nullable: false),
                    Username = table.Column<string>(type: "TEXT", nullable: false),
                    Password = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    UserInformationGuid = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserStateGuid = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Guid);
                    table.ForeignKey(
                        name: "FK_Users_UserInformation_UserInformationGuid",
                        column: x => x.UserInformationGuid,
                        principalTable: "UserInformation",
                        principalColumn: "Guid",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Users_UserState_UserStateGuid",
                        column: x => x.UserStateGuid,
                        principalTable: "UserState",
                        principalColumn: "Guid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserInformationGuid",
                table: "Users",
                column: "UserInformationGuid");

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserStateGuid",
                table: "Users",
                column: "UserStateGuid");

            migrationBuilder.CreateIndex(
                name: "IX_UserSocial_UserInformationGuid",
                table: "UserSocial",
                column: "UserInformationGuid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "UserSocial");

            migrationBuilder.DropTable(
                name: "UserState");

            migrationBuilder.DropTable(
                name: "UserInformation");
        }
    }
}
