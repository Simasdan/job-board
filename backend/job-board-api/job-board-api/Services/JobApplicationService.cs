using job_board_api.Data.DTOs;
using job_board_api.Data.Enums;
using job_board_api.Data.Models;
using job_board_api.Data.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace job_board_api.Services
{
    public class JobApplicationService
    {
        private readonly AppDbContext _context;

        public JobApplicationService(AppDbContext context)
        {
            _context = context;
        }

        public JobApplicationVM? CreateJobApplication(int jobPostId, CreateJobApplicationDto dto, int userId)
        {
            var candidate = _context.Candidates.FirstOrDefault(c => c.UserId == userId);
            if (candidate == null) return null;

            var jobPost = _context.JobPosts.FirstOrDefault(jp => jp.Id == jobPostId && jp.Status == PostStatus.Published);
            if (jobPost == null) return null;

            var alreadyApplied = _context.JobApplications
                .Any(ja => ja.JobPostId == jobPostId && ja.CandidateId == candidate.Id);
            if (alreadyApplied) return null;

            var application = new JobApplication
            {
                JobPostId = jobPostId,
                CandidateId = candidate.Id,
                CoverLetter = dto.CoverLetter,
                ResumeUrl = dto.ResumeUrl,
                Status = ApplicationStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            _context.JobApplications.Add(application);
            _context.SaveChanges();

            return GetJobApplicationById(application.Id);
        }

        public List<JobApplicationVM> GetCandidateApplications(int userId)
        {
            var candidate = _context.Candidates.FirstOrDefault(c => c.UserId == userId);
            if (candidate == null) return new List<JobApplicationVM>();

            var result = _context.JobApplications
                .Include(ja => ja.JobPost)
                .Include(ja => ja.Candidate)
                .Where(ja => ja.CandidateId == candidate.Id)
                .Select(ja => new JobApplicationVM
                {
                    Id = ja.Id,
                    CoverLetter = ja.CoverLetter,
                    ResumeUrl = ja.ResumeUrl,
                    Status = ja.Status.ToString(),
                    CreatedAt = ja.CreatedAt,
                    JobPostId = ja.JobPostId,
                    JobTitle = ja.JobPost!.Title,
                    CandidateName = ja.Candidate!.FullName,
                    CandidateId = ja.CandidateId
                })
                .ToList();

            return result;
        }

        public List<JobApplicationVM> GetJobPostApplications(int jobPostId, int userId)
        {
            var employer = _context.Employers.FirstOrDefault(e => e.UserId == userId);
            if (employer == null) return new List<JobApplicationVM>();

            var jobPost = _context.JobPosts
                .FirstOrDefault(jp => jp.Id == jobPostId && jp.EmployerId == employer.Id);
            if (jobPost == null) return new List<JobApplicationVM>();

            var result = _context.JobApplications
                .Include(ja => ja.JobPost)
                .Include(ja => ja.Candidate)
                .Where(ja => ja.JobPostId == jobPostId)
                .Select(ja => new JobApplicationVM
                {
                    Id = ja.Id,
                    CoverLetter = ja.CoverLetter,
                    ResumeUrl = ja.ResumeUrl,
                    Status = ja.Status.ToString(),
                    CreatedAt = ja.CreatedAt,
                    JobPostId = ja.JobPostId,
                    JobTitle = ja.JobPost!.Title,
                    CandidateName = ja.Candidate!.FullName,
                    CandidateId = ja.CandidateId
                })
                .ToList();

            return result;
        }

        public JobApplicationVM? UpdateJobApplicationStatus(int id, UpdateJobApplicationDto dto, int userId)
        {
            var employer = _context.Employers.FirstOrDefault(e => e.UserId == userId);
            if (employer == null) return null;

            var application = _context.JobApplications
                .Include(ja => ja.JobPost)
                .FirstOrDefault(ja => ja.Id == id && ja.JobPost!.EmployerId == employer.Id);

            if (application == null) return null;

            if (!Enum.TryParse<ApplicationStatus>(dto.Status, true, out var status))
                return null;

            application.Status = status;
            _context.SaveChanges();

            return GetJobApplicationById(application.Id);
        }

        public bool DeleteJobApplication(int id, int userId)
        {
            var candidate = _context.Candidates.FirstOrDefault(c => c.UserId == userId);
            if (candidate == null) return false;

            var application = _context.JobApplications
                .FirstOrDefault(ja => ja.Id == id && ja.CandidateId == candidate.Id);
            if (application == null) return false;

            _context.JobApplications.Remove(application);
            _context.SaveChanges();

            return true;
        }

        private JobApplicationVM? GetJobApplicationById(int id)
        {
            var application = _context.JobApplications
                .Include(ja => ja.JobPost)
                .Include(ja => ja.Candidate)
                .FirstOrDefault(ja => ja.Id == id);

            if (application == null) return null;

            var result = new JobApplicationVM
            {
                Id = application.Id,
                CoverLetter = application.CoverLetter,
                ResumeUrl = application.ResumeUrl,
                Status = application.Status.ToString(),
                CreatedAt = application.CreatedAt,
                JobPostId = application.JobPostId,
                JobTitle = application.JobPost!.Title,
                CandidateName = application.Candidate!.FullName,
                CandidateId = application.CandidateId
            };

            return result;
        }
    }
}
