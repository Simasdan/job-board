namespace job_board_api.Data.DTOs
{
    public class UpdateEmployerProfileDto
    {
        public string CompanyName { get; set; } = string.Empty;
        public string CompanyDescription { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
    }
}
