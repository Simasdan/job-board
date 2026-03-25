namespace job_board_api.Data.DTOs
{
    public class UpdateCandidateProfileDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public string ResumeUrl { get; set; } = string.Empty;
    }
}
