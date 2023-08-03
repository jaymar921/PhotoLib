using Microsoft.EntityFrameworkCore;
using PhotoLib.PhotoMicroService.API.Data;
using PhotoLib.PhotoMicroService.API.Data.PhotosRepository;
using PhotoLib.SystemCore.Libraries.Entity;
using PhotoLib.SystemCore.Libraries.Interfaces;

namespace PhotoLib.PhotoMicroService.API
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
            // add the database context
            builder.Services.AddDbContext<PhotoDbContext>( options => { options.UseSqlite("Data Source=PhotoDatabase_SQLITE"); });
            // Add services to the container.
            builder.Services.AddScoped<IRepository<Photo>, PhotoRepository>();
            builder.Services.AddSingleton<DataHandler>();

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {

            }
            app.UseSwagger();
            app.UseSwaggerUI();

            //app.UseHttpsRedirection();

            // add the cors policy to the app
            app.UseCors(options => options.SetIsOriginAllowed(x => _ = true).AllowAnyMethod().AllowCredentials().AllowAnyHeader());

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}