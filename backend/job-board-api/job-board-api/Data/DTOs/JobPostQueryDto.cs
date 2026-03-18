namespace job_board_api.Data.DTOs
{
    public class JobPostQueryDto
    {
        public string? Title { get; set; }
        public string? Location { get; set; }
        public string? Status { get; set; }
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string? SortBy { get; set; }
        public string? SortOrder { get; set; } // "asc" or "desc"
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
