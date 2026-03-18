using job_board_api.Data.Enums;
using job_board_api.Data.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace job_board_api.Data.ViewModels
{
    public class JobPostVM
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public decimal SalaryMin { get; set; }
        public decimal SalaryMax { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public int EmployerId { get; set; }
    }
}
