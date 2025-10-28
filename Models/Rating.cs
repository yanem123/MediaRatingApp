using System;
namespace MediaRatingApp.Models
{
    public class Rating
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? MediaId { get; set; }
        public string? MediaType { get; set; }
        public int Score { get; set; }
        public string? Comment { get; set; }
        public User? User { get; set; }

        public bool IsValid()
        {
            return Score >= 1 && Score <= 5 && !string.IsNullOrEmpty(MediaId);
        }
    }
}