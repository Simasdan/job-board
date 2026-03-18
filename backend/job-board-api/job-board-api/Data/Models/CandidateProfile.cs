namespace job_board_api.Data.Models
{
    public class CandidateProfile
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string ResumeUrl { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;

        public User? User { get; set; }
        public List<JobApplication>? JobApplications { get; set; }
    }
}
