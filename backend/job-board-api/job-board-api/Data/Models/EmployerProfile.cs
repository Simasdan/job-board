namespace job_board_api.Data.Models
{
    public class EmployerProfile
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string CompanyDescription { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;

        public User? User { get; set; }
        public List<JobPost>? JobPosts { get; set; }
    }
}
