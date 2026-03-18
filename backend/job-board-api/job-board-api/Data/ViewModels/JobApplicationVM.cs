namespace job_board_api.Data.ViewModels
{
    public class JobApplicationVM
    {
        public int Id { get; set; }
        public string CoverLetter { get; set; } = string.Empty;
        public string ResumeUrl { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int JobPostId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string CandidateName { get; set; } = string.Empty;
        public int CandidateId { get; set; }
    }
}
