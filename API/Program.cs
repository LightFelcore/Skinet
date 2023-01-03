using System.Net;
using API.Extensions;
using API.Helpers;
using API.Middleware;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddApplicationServices();
builder.Services.AddDbContext<StoreContext>(x => x.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Setting up Redis as a Singleton connection because it is designed to be reused between callers.
builder.Services.AddSingleton<IConnectionMultiplexer>(c => {
    var configuration = ConfigurationOptions.Parse(builder.Configuration.GetConnectionString("Redis"), true);
    return ConnectionMultiplexer.Connect(configuration);
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAutoMapper(typeof(MappingProfiles));
builder.Services.AddSwaggerDocumentation();
builder.Services.AddCors(options => options.AddPolicy(name: "CorsPolicy",
    policy =>
    {
        policy.WithOrigins("https://localhost:4200").AllowAnyMethod().AllowAnyHeader();
    }
));

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

app.UseStatusCodePagesWithReExecute("/errors/{0}");

app.UseCors("CorsPolicy");

// Redirect user to HTTPS in case of an HTTP request
app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.UseSwaggerDocumentation();

app.MapControllers();

// Apply automatic migrations upon run of the application
// Seed data by using custom method in StoreContextSeed class
using (var scope = app.Services.CreateScope())
{
    var loggerFactory = scope.ServiceProvider.GetRequiredService<ILoggerFactory>();
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
        await context.Database.MigrateAsync();
        await StoreContextSeed.SeedAsync(context, loggerFactory);
    }
    catch (System.Exception ex)
    {
        var logger = loggerFactory.CreateLogger<Program>();
        logger.LogError(ex, "An error occured during migration");
    }
}

app.Run();
