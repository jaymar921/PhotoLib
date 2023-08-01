﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PhotoLib.AlbumMicroService.API.Data;

#nullable disable

namespace PhotoLib.AlbumMicroService.API.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    partial class DatabaseContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "7.0.9");

            modelBuilder.Entity("PhotoLib.SystemCore.Libraries.Entity.Album", b =>
                {
                    b.Property<Guid>("Guid")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<Guid>("AlbumStateGuid")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<Guid>("User")
                        .HasColumnType("TEXT");

                    b.HasKey("Guid");

                    b.HasIndex("AlbumStateGuid");

                    b.ToTable("Albums");
                });

            modelBuilder.Entity("PhotoLib.SystemCore.Libraries.Entity.AlbumState", b =>
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

                    b.ToTable("AlbumStates");
                });

            modelBuilder.Entity("PhotoLib.SystemCore.Libraries.Entity.Album", b =>
                {
                    b.HasOne("PhotoLib.SystemCore.Libraries.Entity.AlbumState", "AlbumState")
                        .WithMany()
                        .HasForeignKey("AlbumStateGuid")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AlbumState");
                });
#pragma warning restore 612, 618
        }
    }
}