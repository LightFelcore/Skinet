using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContext : IdentityDbContext<AppUser>
    {

        // NOTE: In order to make this work, configuration need to be made in the startup class. For this configuration, a extension class has been made.
        
        // For the first migration you need to do this. This will make the migrations and store them in a folder located in the Identity folder
        // dotnet ef migrations add IdentityInitial -p .\Infrastructure\ -s .\API\ -c AppIdentityDbContext -o Identity/Migrations
        
        public AppIdentityDbContext(DbContextOptions<AppIdentityDbContext> options) : base(options)
        {
            // We dont need custom dbSets because they already come within IdenityDbContext
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            // If we dont do this we will run into errors when using identity with the PK its using
            base.OnModelCreating(builder);
        }
    }
}