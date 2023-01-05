using System.Security.Claims;
using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        // UserManager ==> Get the user from the database
        // SignInManager ==> Check user's password against what's stored inside the database
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService, IMapper mapper)
        {
            _mapper = mapper;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUserAsync()
        {
            // Get the user by email
            var user = await _userManager.FindUserByEmailFromClaimsPricipal(User);

            return new UserDto
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };
        }

        [HttpGet("emailexists")]
        public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
        {
            // The user manager will return null in case an email has not been found
            return await _userManager.FindByEmailAsync(email) != null;
        }

        [Authorize]
        [HttpGet("address")]
        public async Task<ActionResult<AddressDto>> GetUserAddress()
        {
            // Get the user by email
            var user = await _userManager.FindUserByClaimsPricipalWithAddressAsync(User);

            // return the user address
            return _mapper.Map<Address, AddressDto>(user.Address);

        }

        [Authorize]
        [HttpPut("address")]
        public async Task<ActionResult<AddressDto>> UpdateUserAddress(AddressDto address)
        {
            // Get the user by email
            var user = await _userManager.FindUserByClaimsPricipalWithAddressAsync(User);

            // Map the AddressDto to an Address
            // In the MappingProfiles, .ReverseMap() needs to be used in order to map from AddressDto to Address
            user.Address = _mapper.Map<AddressDto, Address>(address);

            // Update the address through UserManager
            var result = await _userManager.UpdateAsync(user);

            // Bad result zhen updating the user
            if (!result.Succeeded) return BadRequest("Problem updating the user");

            // Return the AddressDto by converting the Address
            return Ok(_mapper.Map<Address, AddressDto>(user.Address));
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            // get the user by email in a async way
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            // No user found in the database
            if (user == null) return Unauthorized(new ApiResponse(401));

            // The false flag can be set to true to prevent bruteforce attacks so that a maximum amount of login attempts are set
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            // If we dont get an appropriate result
            if (!result.Succeeded) return Unauthorized(new ApiResponse(401));

            return new UserDto
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            // Check if email already exists
            if (CheckEmailExistsAsync(registerDto.Email).Result.Value)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse
                {
                    Errors = new[] { "Email is already in use" }
                });
            }

            // Create a new user
            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            // Create a new user with given information
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(new ApiResponse(400));

            return new UserDto
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };
        }
    }
}