﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PhotoLib.AuthMicroService.API.Data.UserRepository;

#nullable disable

namespace PhotoLib.AuthMicroService.API.Migrations
{
    [DbContext(typeof(UserDBContext))]
    [Migration("20230724123421_InitialMigration")]
    partial class InitialMigration
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "7.0.9");

            modelBuilder.Entity("PhotoLib.SystemCore.Libraries.Entity.User", b =>
                {
                    b.Property<Guid>("Guid")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<Guid>("UserInformationGuid")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("UserStateGuid")
                        .HasColumnType("TEXT");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Guid");

                    b.HasIndex("UserInformationGuid");

                    b.HasIndex("UserStateGuid");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("PhotoLib.SystemCore.Libraries.Entity.UserInformation", b =>
                {
                    b.Property<Guid>("Guid")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Bio")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Country")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Firstname")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Lastname")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Pronouns")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Guid");

                    b.ToTable("UserInformation");
                });

            modelBuilder.Entity("PhotoLib.SystemCore.Libraries.Entity.UserSocial", b =>
                {
                    b.Property<Guid>("Guid")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Link")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Platform")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<Guid?>("UserInformationGuid")
                        .HasColumnType("TEXT");

                    b.HasKey("Guid");

                    b.HasIndex("UserInformationGuid");

                    b.ToTable("UserSocial");
                });

            modelBuilder.Entity("PhotoLib.SystemCore.Libraries.Entity.UserState", b =>
                {
                    b.Property<Guid>("Guid")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("DateLastModified")
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsPublic")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Remark")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("Views")
                        .HasColumnType("INTEGER");

                    b.HasKey("Guid");

                    b.ToTable("UserState");
                });

            modelBuilder.Entity("PhotoLib.SystemCore.Libraries.Entity.User", b =>
                {
                    b.HasOne("PhotoLib.SystemCore.Libraries.Entity.UserInformation", "UserInformation")
                        .WithMany()
                        .HasForeignKey("UserInformationGuid")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("PhotoLib.SystemCore.Libraries.Entity.UserState", "UserState")
                        .WithMany()
                        .HasForeignKey("UserStateGuid")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("UserInformation");

                    b.Navigation("UserState");
                });

            modelBuilder.Entity("PhotoLib.SystemCore.Libraries.Entity.UserSocial", b =>
                {
                    b.HasOne("PhotoLib.SystemCore.Libraries.Entity.UserInformation", null)
                        .WithMany("Socials")
                        .HasForeignKey("UserInformationGuid");
                });

            modelBuilder.Entity("PhotoLib.SystemCore.Libraries.Entity.UserInformation", b =>
                {
                    b.Navigation("Socials");
                });
#pragma warning restore 612, 618
        }
    }
}