namespace job_board_api.Data.Enums
{
    public enum PostStatus
    {
        Draft,
        Published,
        Closed
    }

    public enum ApplicationStatus
    {
        Pending,
        Reviewed,
        Accepted,
        Rejected
    }

    public enum Role
    {
        Candidate,
        Employer,
        Admin
    }
}
