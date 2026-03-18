using job_board_api.Data.Enums;

namespace job_board_api.Data.Models
{
    public class JobApplication
    {
        public int Id { get; set; }
        public string CoverLetter { get; set; } = string.Empty;
        public string ResumeUrl { get; set; } = string.Empty;
        public int JobPostId { get; set; }
        public JobPost? JobPost { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ApplicationStatus Status { get; set; }

        public int CandidateId { get; set; }
        public CandidateProfile? Candidate { get; set; }
    }
}
