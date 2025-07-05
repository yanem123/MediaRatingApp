using Microsoft.AspNetCore.Mvc;
using MediaRatingApp.Data;
using MediaRatingApp.Models;
using Microsoft.EntityFrameworkCore;
using MediaRatingApp.DTOs;
using BCrypt.Net;

namespace MediaRatingApp.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }


        [HttpPost]
        public async Task<ActionResult<User>> Register(UserRegisterDto request)
        {
            
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest("User already exists.");
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newUser = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = passwordHash
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllUsers), new { id = newUser.Id }, newUser);
        }
    }
}
