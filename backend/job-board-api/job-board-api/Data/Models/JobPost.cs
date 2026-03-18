using job_board_api.Data.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace job_board_api.Data.Models
{
    public class JobPost
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal SalaryMin { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal SalaryMax { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public PostStatus Status { get; set; }

        public int EmployerId { get; set; }
        public EmployerProfile? Employer { get; set; }
        public List<JobApplication>? Applications { get; set; }
    }
}
