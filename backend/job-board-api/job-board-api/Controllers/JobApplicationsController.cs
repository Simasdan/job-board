using Asp.Versioning;
using job_board_api.Data.DTOs;
using job_board_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace job_board_api.Controllers
{
    [Route("api/v{version:apiVersion}/jobapplications")]
    [ApiController]
    [ApiVersion("1.0")]
    public class JobApplicationsController : ControllerBase
    {
        private readonly JobApplicationService _jobApplicationService;

        public JobApplicationsController(JobApplicationService jobApplicationService)
        {
            _jobApplicationService = jobApplicationService;
        }

        [HttpPost("{jobPostId}")]
        [Authorize(Roles = "Candidate")]
        public IActionResult CreteJobApplication(int jobPostId, [FromBody] CreateJobApplicationDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var application = _jobApplicationService.CreateJobApplication(jobPostId, dto, userId.Value);

            if (application == null)
            {
                return BadRequest("Could not create application. Job post may not exist, already applied, or you are not a candidate.");
            }

            return Ok(application);
        }

        [HttpGet("my-applications")]
        [Authorize(Roles = "Candidate")]
        public IActionResult GetCandidateApplications()
        {
            var userId = GetUserId();
            if(userId == null) return Unauthorized();

            var applications = _jobApplicationService.GetCandidateApplications(userId.Value);
            return Ok(applications);
        }

        [HttpGet("jobpost/{jobPostId}")]
        [Authorize(Roles = "Employer")]
        public IActionResult GetJobPostApplications(int jobPostId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var applications = _jobApplicationService.GetJobPostApplications(jobPostId, userId.Value);

            return Ok(applications);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Employer")]
        public IActionResult UpdateJobApplicationStatus(int id, [FromBody]UpdateJobApplicationDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var application = _jobApplicationService.UpdateJobApplicationStatus(id, dto, userId.Value);

            if (application == null)
            {
                return NotFound("Application not found or you don't have permission.");
            }
                

            return Ok(application);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Candidate")]
        public IActionResult DeleteJobApplication(int id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = _jobApplicationService.DeleteJobApplication(id, userId.Value);

            if (!result)
            {
                return NotFound("Application not found or you don't have permission.");
            }
                

            return Ok("Application withdrawn successfully.");
        }


        private int? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out var userId))
            {
                return userId;
            }
                
            return null;
        }
    }
}
