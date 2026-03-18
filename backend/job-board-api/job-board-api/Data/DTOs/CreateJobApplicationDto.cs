namespace job_board_api.Data.DTOs
{
    public class CreateJobApplicationDto
    {
        public string CoverLetter { get; set; } = string.Empty;
        public string ResumeUrl { get; set; } = string.Empty;
    }
}
