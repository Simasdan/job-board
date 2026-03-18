using job_board_api.Data.Enums;
using job_board_api.Data.Models;

namespace job_board_api
{
    public class AppDbInitializer
    {
        public static void Seed(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<AppDbContext>();

                if (context == null) return;

                if (!context.Users.Any())
                {
                    // =====================
                    // USERS
                    // =====================
                    var demoCandidate = new User
                    {
                        Email = "candidate@demo.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Demo123!"),
                        Role = Role.Candidate,
                        CreatedAt = DateTime.UtcNow
                    };

                    var demoEmployer = new User
                    {
                        Email = "employer@demo.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Demo123!"),
                        Role = Role.Employer,
                        CreatedAt = DateTime.UtcNow
                    };

                    var employer2 = new User
                    {
                        Email = "microsoft@demo.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Demo123!"),
                        Role = Role.Employer,
                        CreatedAt = DateTime.UtcNow
                    };

                    var employer3 = new User
                    {
                        Email = "amazon@demo.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Demo123!"),
                        Role = Role.Employer,
                        CreatedAt = DateTime.UtcNow
                    };

                    var employer4 = new User
                    {
                        Email = "meta@demo.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Demo123!"),
                        Role = Role.Employer,
                        CreatedAt = DateTime.UtcNow
                    };

                    context.Users.AddRange(demoCandidate, demoEmployer, employer2, employer3, employer4);
                    context.SaveChanges();

                    // =====================
                    // PROFILES
                    // =====================
                    var candidateProfile = new CandidateProfile
                    {
                        UserId = demoCandidate.Id,
                        FullName = "John Doe",
                        Bio = "Passionate software developer with 3 years of experience in .NET and React.",
                        ResumeUrl = "https://johndoe.com/resume"
                    };

                    var demoEmployerProfile = new EmployerProfile
                    {
                        UserId = demoEmployer.Id,
                        CompanyName = "Google",
                        CompanyDescription = "A global technology company specializing in search, cloud computing and software.",
                        Website = "https://google.com"
                    };

                    var employer2Profile = new EmployerProfile
                    {
                        UserId = employer2.Id,
                        CompanyName = "Microsoft",
                        CompanyDescription = "A global technology company known for Windows, Azure and Office.",
                        Website = "https://microsoft.com"
                    };

                    var employer3Profile = new EmployerProfile
                    {
                        UserId = employer3.Id,
                        CompanyName = "Amazon",
                        CompanyDescription = "A global e-commerce and cloud computing company.",
                        Website = "https://amazon.com"
                    };

                    var employer4Profile = new EmployerProfile
                    {
                        UserId = employer4.Id,
                        CompanyName = "Meta",
                        CompanyDescription = "A global technology company focused on social media and virtual reality.",
                        Website = "https://meta.com"
                    };

                    context.Candidates.AddRange(candidateProfile);
                    context.Employers.AddRange(demoEmployerProfile, employer2Profile, employer3Profile, employer4Profile);
                    context.SaveChanges();

                    // =====================
                    // JOB POSTS
                    // =====================
                    var jobPosts = new List<JobPost>
                    {
                        // Google jobs
                        new JobPost { Title = "Senior .NET Developer", Description = "We are looking for an experienced .NET developer to join our backend team.", Location = "Vilnius", SalaryMin = 4000, SalaryMax = 6000, Status = PostStatus.Published, EmployerId = demoEmployerProfile.Id, CreatedAt = DateTime.UtcNow.AddDays(-10) },
                        new JobPost { Title = "React Frontend Developer", Description = "Join our frontend team building modern web applications.", Location = "Kaunas", SalaryMin = 3500, SalaryMax = 5000, Status = PostStatus.Published, EmployerId = demoEmployerProfile.Id, CreatedAt = DateTime.UtcNow.AddDays(-8) },
                        new JobPost { Title = "DevOps Engineer", Description = "Looking for a DevOps engineer to manage our cloud infrastructure.", Location = "Vilnius", SalaryMin = 4500, SalaryMax = 7000, Status = PostStatus.Published, EmployerId = demoEmployerProfile.Id, CreatedAt = DateTime.UtcNow.AddDays(-5) },
                        new JobPost { Title = "Junior Python Developer", Description = "Great opportunity for a junior developer to grow with our team.", Location = "Remote", SalaryMin = 2000, SalaryMax = 3000, Status = PostStatus.Draft, EmployerId = demoEmployerProfile.Id, CreatedAt = DateTime.UtcNow.AddDays(-2) },

                        // Microsoft jobs
                        new JobPost { Title = "Cloud Solutions Architect", Description = "Design and implement cloud solutions on Azure.", Location = "Vilnius", SalaryMin = 5000, SalaryMax = 8000, Status = PostStatus.Published, EmployerId = employer2Profile.Id, CreatedAt = DateTime.UtcNow.AddDays(-15) },
                        new JobPost { Title = "Full Stack Developer", Description = "Work on exciting projects using .NET and React.", Location = "Remote", SalaryMin = 3500, SalaryMax = 5500, Status = PostStatus.Published, EmployerId = employer2Profile.Id, CreatedAt = DateTime.UtcNow.AddDays(-7) },
                        new JobPost { Title = "QA Engineer", Description = "Ensure quality across our software products.", Location = "Kaunas", SalaryMin = 2500, SalaryMax = 4000, Status = PostStatus.Closed, EmployerId = employer2Profile.Id, CreatedAt = DateTime.UtcNow.AddDays(-20) },

                        // Amazon jobs
                        new JobPost { Title = "Backend Engineer", Description = "Build scalable backend services for millions of users.", Location = "Vilnius", SalaryMin = 4000, SalaryMax = 6500, Status = PostStatus.Published, EmployerId = employer3Profile.Id, CreatedAt = DateTime.UtcNow.AddDays(-3) },
                        new JobPost { Title = "Data Engineer", Description = "Design and maintain data pipelines and warehouses.", Location = "Remote", SalaryMin = 4500, SalaryMax = 7000, Status = PostStatus.Published, EmployerId = employer3Profile.Id, CreatedAt = DateTime.UtcNow.AddDays(-6) },
                        new JobPost { Title = "Mobile Developer", Description = "Develop iOS and Android applications.", Location = "Klaipeda", SalaryMin = 3000, SalaryMax = 5000, Status = PostStatus.Published, EmployerId = employer3Profile.Id, CreatedAt = DateTime.UtcNow.AddDays(-1) },

                        // Meta jobs
                        new JobPost { Title = "Machine Learning Engineer", Description = "Work on cutting edge ML models and AI features.", Location = "Vilnius", SalaryMin = 5500, SalaryMax = 9000, Status = PostStatus.Published, EmployerId = employer4Profile.Id, CreatedAt = DateTime.UtcNow.AddDays(-4) },
                        new JobPost { Title = "Security Engineer", Description = "Protect our systems and user data.", Location = "Remote", SalaryMin = 5000, SalaryMax = 8000, Status = PostStatus.Published, EmployerId = employer4Profile.Id, CreatedAt = DateTime.UtcNow.AddDays(-9) },
                        new JobPost { Title = "Product Manager", Description = "Lead product development for our social media platform.", Location = "Kaunas", SalaryMin = 4000, SalaryMax = 6000, Status = PostStatus.Draft, EmployerId = employer4Profile.Id, CreatedAt = DateTime.UtcNow.AddDays(-11) },
                    };

                    context.JobPosts.AddRange(jobPosts);
                    context.SaveChanges();

                    // =====================
                    // JOB APPLICATIONS
                    // =====================
                    var applications = new List<JobApplication>
                    {
                        new JobApplication { JobPostId = jobPosts[0].Id, CandidateId = candidateProfile.Id, CoverLetter = "I am very excited about this opportunity at Google.", ResumeUrl = "https://johndoe.com/resume", Status = ApplicationStatus.Accepted, CreatedAt = DateTime.UtcNow.AddDays(-9) },
                        new JobApplication { JobPostId = jobPosts[1].Id, CandidateId = candidateProfile.Id, CoverLetter = "Frontend development is my passion and I would love to join Google.", ResumeUrl = "https://johndoe.com/resume", Status = ApplicationStatus.Pending, CreatedAt = DateTime.UtcNow.AddDays(-7) },
                        new JobApplication { JobPostId = jobPosts[4].Id, CandidateId = candidateProfile.Id, CoverLetter = "I have extensive experience with Azure and would be a great fit.", ResumeUrl = "https://johndoe.com/resume", Status = ApplicationStatus.Rejected, CreatedAt = DateTime.UtcNow.AddDays(-14) },
                        new JobApplication { JobPostId = jobPosts[5].Id, CandidateId = candidateProfile.Id, CoverLetter = "Full stack development is exactly what I do best.", ResumeUrl = "https://johndoe.com/resume", Status = ApplicationStatus.Reviewed, CreatedAt = DateTime.UtcNow.AddDays(-6) },
                        new JobApplication { JobPostId = jobPosts[7].Id, CandidateId = candidateProfile.Id, CoverLetter = "I would love to build scalable systems at Amazon.", ResumeUrl = "https://johndoe.com/resume", Status = ApplicationStatus.Pending, CreatedAt = DateTime.UtcNow.AddDays(-2) },
                        new JobApplication { JobPostId = jobPosts[10].Id, CandidateId = candidateProfile.Id, CoverLetter = "Machine learning is my speciality and Meta is my dream company.", ResumeUrl = "https://johndoe.com/resume", Status = ApplicationStatus.Pending, CreatedAt = DateTime.UtcNow.AddDays(-3) },
                    };

                    context.JobApplications.AddRange(applications);
                    context.SaveChanges();
                }
            }
        }
    }
}
