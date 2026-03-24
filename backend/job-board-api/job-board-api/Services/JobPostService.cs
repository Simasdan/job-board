using job_board_api.Data.DTOs;
using job_board_api.Data.Enums;
using job_board_api.Data.Models;
using job_board_api.Data.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace job_board_api.Services
{
    public class JobPostService
    {
        private readonly AppDbContext _context;

        public JobPostService(AppDbContext context)
        {
            _context = context;
        }

        public PagedResultVM<JobPostVM> GetAllJobPosts(JobPostQueryDto query)
        {
            var jobPosts = _context.JobPosts
                .Include(jp => jp.Employer)
                .Include(jp => jp.Applications)
                .AsQueryable();

            // Filtering
            if (!string.IsNullOrEmpty(query.Title))
                jobPosts = jobPosts.Where(jp => jp.Title.Contains(query.Title));

            if (!string.IsNullOrEmpty(query.Location))
                jobPosts = jobPosts.Where(jp => jp.Location.Contains(query.Location));

            if (!string.IsNullOrEmpty(query.Status) && Enum.TryParse<PostStatus>(query.Status, true, out var status))
                jobPosts = jobPosts.Where(jp => jp.Status == status);
            else
                jobPosts = jobPosts.Where(jp => jp.Status == PostStatus.Published);

            if (query.SalaryMin.HasValue)
                jobPosts = jobPosts.Where(jp => jp.SalaryMin >= query.SalaryMin.Value);

            if (query.SalaryMax.HasValue)
                jobPosts = jobPosts.Where(jp => jp.SalaryMax <= query.SalaryMax.Value);

            // Sorting
            jobPosts = query.SortBy?.ToLower() 
                switch
                {
                    "salary" when query.SortOrder?.ToLower() == "asc" => jobPosts.OrderBy(jp => jp.SalaryMin),
                    "salary" => jobPosts.OrderByDescending(jp => jp.SalaryMin),
                    "createdat" when query.SortOrder?.ToLower() == "asc" => jobPosts.OrderBy(jp => jp.CreatedAt),
                    _ => jobPosts.OrderByDescending(jp => jp.CreatedAt)
                };

            // Pagination
            var totalCount = jobPosts.Count();
            var totalPages = (int)Math.Ceiling((double)totalCount / query.PageSize);
            var skip = (query.Page - 1) * query.PageSize;

            var items = jobPosts
                .Skip(skip)
                .Take(query.PageSize)
                .Select(jp => new JobPostVM
                {
                    Id = jp.Id,
                    Title = jp.Title,
                    Description = jp.Description,
                    Location = jp.Location,
                    SalaryMin = jp.SalaryMin,
                    SalaryMax = jp.SalaryMax,
                    Status = jp.Status.ToString(),
                    CreatedAt = jp.CreatedAt,
                    CompanyName = jp.Employer!.CompanyName,
                    EmployerId = jp.EmployerId,
                    ApplicationCount = jp.Applications != null ? jp.Applications.Count : 0
                })
                .ToList();

            var result = new PagedResultVM<JobPostVM>
            {
                Items = items,
                CurrentPage = query.Page,
                TotalPages = totalPages,
                TotalCount = totalCount
            };

            return result;
        }

        public JobPostVM? GetJobPostById(int id)
        {
            var jobPost = _context.JobPosts
                .Include(jp => jp.Employer)
                .Include(jp => jp.Applications)
                .FirstOrDefault(jp => jp.Id == id);

            if (jobPost == null) return null;

            var result = new JobPostVM
            {
                Id = jobPost.Id,
                Title = jobPost.Title,
                Description = jobPost.Description,
                Location = jobPost.Location,
                SalaryMin = jobPost.SalaryMin,
                SalaryMax = jobPost.SalaryMax,
                Status = jobPost.Status.ToString(),
                CreatedAt = jobPost.CreatedAt,
                CompanyName = jobPost.Employer!.CompanyName,
                EmployerId = jobPost.EmployerId,
                ApplicationCount = jobPost.Applications != null ? jobPost.Applications.Count : 0
            };

            return result;
        }

        public List<JobPostVM> GetEmployerJobPosts(int userId)
        {
            var employer = _context.Employers.FirstOrDefault(e => e.UserId == userId);
            if (employer == null) return new List<JobPostVM>();

            return _context.JobPosts
                .Include(jp => jp.Employer)
                .Include(jp => jp.Applications)
                .Where(jp => jp.EmployerId == employer.Id)
                .OrderByDescending(jp => jp.CreatedAt)
                .Select(jp => new JobPostVM
                {
                    Id = jp.Id,
                    Title = jp.Title,
                    Description = jp.Description,
                    Location = jp.Location,
                    SalaryMin = jp.SalaryMin,
                    SalaryMax = jp.SalaryMax,
                    Status = jp.Status.ToString(),
                    CreatedAt = jp.CreatedAt,
                    CompanyName = jp.Employer!.CompanyName,
                    EmployerId = jp.EmployerId,
                    ApplicationCount = jp.Applications != null ? jp.Applications.Count : 0
                })
                .ToList();
        }

        public JobPostVM? CreateJobPost(CreateJobPostDto dto, int userId)
        {
            var employer = _context.Employers.FirstOrDefault(e => e.UserId == userId);

            if (employer == null) return null;

            var jobPost = new JobPost
            {
                Title = dto.Title,
                Description = dto.Description,
                Location = dto.Location,
                SalaryMin = dto.SalaryMin,
                SalaryMax = dto.SalaryMax,
                Status = PostStatus.Draft,
                EmployerId = employer.Id
            };

            _context.JobPosts.Add(jobPost);
            _context.SaveChanges();

            return GetJobPostById(jobPost.Id);
        }

        public JobPostVM? UpdateJobPost(int id, UpdateJobPostDto dto, int userId)
        {
            var employer = _context.Employers.FirstOrDefault(e => e.UserId == userId);
            if (employer == null) return null;

            var jobPost = _context.JobPosts
                .FirstOrDefault(jp => jp.Id == id && jp.EmployerId == employer.Id);

            if (jobPost == null) return null;

            if (dto.Title != null) jobPost.Title = dto.Title;
            if (dto.Description != null) jobPost.Description = dto.Description;
            if (dto.Location != null) jobPost.Location = dto.Location;
            if (dto.SalaryMin != null) jobPost.SalaryMin = dto.SalaryMin.Value;
            if (dto.SalaryMax != null) jobPost.SalaryMax = dto.SalaryMax.Value;
            if (dto.Status != null && Enum.TryParse<PostStatus>(dto.Status, true, out var status))
                jobPost.Status = status;

            _context.SaveChanges();

            return GetJobPostById(jobPost.Id);
        }

        public bool DeleteJobPost(int id, int userId)
        {
            var employer = _context.Employers.FirstOrDefault(e => e.UserId == userId);
            if (employer == null) return false;

            var jobPost = _context.JobPosts
                .FirstOrDefault(jp => jp.Id == id && jp.EmployerId == employer.Id);

            if (jobPost == null) return false;

            _context.JobPosts.Remove(jobPost);
            _context.SaveChanges();

            return true;
        }
    }
}
