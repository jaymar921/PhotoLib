using Microsoft.EntityFrameworkCore;
using PhotoLib.AlbumMicroService.API.Data;
using PhotoLib.AlbumMicroService.API.Data.Repository;
using PhotoLib.SystemCore.Libraries.Entity;
using PhotoLib.SystemCore.Libraries.Interfaces;

namespace PhotoLib.AlbumMicroService.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            string policyCorsName = "APICors";
            builder.Services.AddCors(options => {
                options.AddPolicy(name: policyCorsName, builder =>
                {
                    builder.WithOrigins("*").WithMethods("*");
                });
            });
            // Add services to the container.
            builder.Services.AddDbContext<DatabaseContext>(option => option.UseSqlite("Data Source=ALBUM_DB_SQLITE"));

            builder.Services.AddScoped<IRepository<Album>,AlbumRepository>();

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
                db.Initialize();
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {

            }
            app.UseSwagger();
            app.UseSwaggerUI();

            // app.UseHttpsRedirection();

            app.UseAuthorization();

            // cors policy
            app.UseCors(option => option.SetIsOriginAllowed( x => _ = true).AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()); ;


            app.MapControllers();

            app.Run();
        }
    }
}