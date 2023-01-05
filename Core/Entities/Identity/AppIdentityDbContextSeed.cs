using Microsoft.AspNetCore.Identity;

namespace Core.Entities.Identity
{
    public class AppIdentityDbContextSeed
    {
        // This is needed in order to have data (users) to work with
        public static async Task SeedUserAsync(UserManager<AppUser> userManager) {
            // Check wether there are already users
            if(!userManager.Users.Any()) {
                // Create a new user
                var user = new AppUser
                {
                    DisplayName = "Bob",
                    Email = "bob@test.com",
                    UserName = "bob@test.com",
                    Address = new Address 
                    {
                        FirstName = "Bob",
                        LastName = "Bobbity",
                        Street = "10 The Street",
                        City = "New York",
                        State = "NY",
                        ZipCode = "90210"
                    }
                };

                // Create the user with a complex password using the userManager
                // Required: Upper letter, lower letter, special character, number
                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }
    }
}