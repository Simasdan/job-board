namespace job_board_api.Data.DTOs
{
    public class RegisterDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Role { get; set; }

        // Candidate fields
        public string? FullName { get; set; }
        public string? Bio { get; set; }

        // Employer fields
        public string? CompanyName { get; set; }
        public string? CompanyDescription { get; set; }
        public string? Website { get; set; }
    }
}
