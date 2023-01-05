using System.Security.Claims;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    // Those methods can be used on the usermanager in order to save some time and effort
    public static class UserManagerExtensions
    {
        // This method will allow to obtain the user with their address through there email
        public static async Task<AppUser> FindUserByClaimsPricipalWithAddressAsync(this UserManager<AppUser> input, ClaimsPrincipal user)
        {
            var email = user.FindFirstValue(ClaimTypes.Email);

            return await input.Users.Include(x => x.Address).SingleOrDefaultAsync(x => x.Email == email);
        }

        // This method will allow to obtain the user through there email
        public static async Task<AppUser> FindUserByEmailFromClaimsPricipal(this UserManager<AppUser> input, ClaimsPrincipal user)
        {
            var email = user.FindFirstValue(ClaimTypes.Email);

            return await input.Users.SingleOrDefaultAsync(x => x.Email == email);
        }
    }
}