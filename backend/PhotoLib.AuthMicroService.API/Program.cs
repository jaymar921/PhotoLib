using Microsoft.EntityFrameworkCore;
using PhotoLib.AuthMicroService.API.Data;
using PhotoLib.AuthMicroService.API.Data.UserRepository;
using PhotoLib.SystemCore.Libraries.Entity;
using PhotoLib.SystemCore.Libraries.Interfaces;

namespace PhotoLib.AuthMicroService.API
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

            // Add the db context
            builder.Services.AddDbContext<UserDBContext>(options => options.UseSqlite("Data Source=UserDatabase_SQLITE"));
            builder.Services.Configure<UserDBContext>(options => { options.Initialize(); }); 

            // Add services to the container.
            builder.Services.AddSingleton<SessionHandler>();
            builder.Services.AddScoped<IRepository<User>, UserRepository>();

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            //app.UseHttpsRedirection();

            // add the cors policy to the app
            app.UseCors(options => options.SetIsOriginAllowed(x => _ =  true).AllowAnyMethod().AllowCredentials().AllowAnyHeader());

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}