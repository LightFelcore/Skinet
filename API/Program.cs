using API.Extensions;
using API.Helpers;
using API.Middleware;
using Core.Entities.Identity;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddApplicationServices();
// Identity Services - extensions
builder.Services.AddIdentityServices(builder.Configuration);

// DbContexts
builder.Services.AddDbContext<StoreContext>(x => x.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddDbContext<AppIdentityDbContext>(x => x.UseNpgsql(builder.Configuration.GetConnectionString("IdentityConnection")));

// Setting up Redis as a Singleton connection because it is designed to be reused between callers.
builder.Services.AddSingleton<IConnectionMultiplexer>(c =>
{
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

app.UseStaticFiles(); // wwwroot folder
app.UseStaticFiles(new StaticFileOptions // Content folder for our images
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Content")
    ),
    RequestPath = "/content"
});

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.UseSwaggerDocumentation();

app.MapControllers();

app.MapFallbackToController("Index", "Fallback");

// Apply automatic migrations upon run of the application
// Seed data by using custom method in StoreContextSeed class
using (var scope = app.Services.CreateScope())
{
    var loggerFactory = scope.ServiceProvider.GetRequiredService<ILoggerFactory>();
    try
    {
        // Seed data for the store
        var storeContext = scope.ServiceProvider.GetRequiredService<StoreContext>();
        await storeContext.Database.MigrateAsync();
        await StoreContextSeed.SeedAsync(storeContext, loggerFactory);

        // Seed data for identity
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        var identityContext = scope.ServiceProvider.GetRequiredService<AppIdentityDbContext>();
        await identityContext.Database.MigrateAsync();
        await AppIdentityDbContextSeed.SeedUserAsync(userManager);
    }
    catch (System.Exception ex)
    {
        var logger = loggerFactory.CreateLogger<Program>();
        logger.LogError(ex, "An error occured during migration");
    }
}

app.Run();
