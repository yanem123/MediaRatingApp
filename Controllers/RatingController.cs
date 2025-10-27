using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using MediaRatingApp.Data;
using MediaRatingApp.Models;
using MediaRatingApp.DTOs;

namespace MediaRatingApp.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class RatingsController : ControllerBase
	{
		private readonly AppDbContext _context;

		public RatingsController(AppDbContext context)
		{
			_context = context;
		}

		[HttpPost]
		public async Task<IActionResult> AddOrUpdateRating([FromBody] Rating rating)
		{
			if (rating == null || rating.UserId <= 0 || string.IsNullOrEmpty(rating.MediaId))
			{
				return BadRequest("Invalid rating data");
			}


			var existingRating = await _context.Ratings
				.FirstOrDefaultAsync(r => r.UserId == rating.UserId && r.MediaId == rating.MediaId);

			if (existingRating != null)
			{
				existingRating.Score = rating.Score;
				existingRating.MediaType = rating.MediaType;
				existingRating.Comment = rating.Comment;
				_context.Ratings.Update(existingRating);
			}
			else
			{
				await _context.Ratings.AddAsync(rating);
			}

			await _context.SaveChangesAsync();

			var userRatings = await _context.Ratings
				.Where(r => r.UserId == rating.UserId)
				.Include(r => r.User)
				.Select(r => new RatingDto
				{
					Id = r.Id,
					MediaId = r.MediaId,
					MediaType = r.MediaType,
					Score = r.Score,
					Comment = r.Comment,
					Username = r.User.Username,
					Email = r.User.Email
				})
				.ToListAsync();

			return Ok(userRatings);
		}

		[HttpGet("{userId}")]
		public async Task<IActionResult> GetUserRatings(int userId)
		{
			var ratings = await _context.Ratings
				.Where(r => r.UserId == userId)
				.Include(r => r.User)
				.Select(r => new RatingDto{
					Id = r.Id,
					MediaId = r.MediaId,
					MediaType = r.MediaType,
					Score = r.Score,
					Comment = r.Comment,
					Username = r.User.Username,
					Email = r.User.Email
					})
				.ToListAsync();

			if (ratings == null || !ratings.Any())
				return NotFound("No ratings found for this user");

			return Ok(ratings);
		}
		[HttpDelete("user/{userId}")]
		public async Task<IActionResult> DeleteRatingsForUser(int userId)
		{
			var toDelete = await _context.Ratings.Where(r => r.UserId == userId).ToListAsync();
			if (!toDelete.Any()) return NotFound("No ratings found for this user.");

			_context.Ratings.RemoveRange(toDelete);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteRating(int id)
		{
			var rating = await _context.Ratings.FindAsync(id);
			if (rating == null)
				return NotFound();

			_context.Ratings.Remove(rating);
			await _context.SaveChangesAsync();

			return NoContent();
		}
	}
}

