namespace MediaRatingApp.DTOs
{
	public class RatingDto
	{
		public int Id { get; set; }
		public string MediaId { get; set; } = string.Empty;
		public string MediaType { get; set; } = string.Empty;
		public int Score { get; set; }
		public string? Comment { get; set; }
		public string Username { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
	}
}
