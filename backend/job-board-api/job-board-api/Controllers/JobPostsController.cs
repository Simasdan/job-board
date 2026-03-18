using Asp.Versioning;
using job_board_api.Data.DTOs;
using job_board_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace job_board_api.Controllers
{
    [Route("api/v{version:apiVersion}/jobposts")]
    [ApiController]
    [ApiVersion("1.0")]
    public class JobPostsController : ControllerBase
    {
        private readonly JobPostService _jobPostService;

        public JobPostsController(JobPostService jobPostService)
        {
            _jobPostService = jobPostService;
        }

        [HttpGet]
        public IActionResult GetJobPosts([FromQuery] JobPostQueryDto query)
        {
            var jobPosts = _jobPostService.GetAllJobPosts(query);
            return Ok(jobPosts);
        }

        [HttpGet("{id}")]
        public IActionResult GetJobPostById(int id)
        {
            var jobPost = _jobPostService.GetJobPostById(id);

            if (jobPost == null) return NotFound("Job post not found.");

            return Ok(jobPost);
        }

        [HttpPost]
        [Authorize(Roles = "Employer")]
        public IActionResult CreateJobPost([FromBody] CreateJobPostDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var jobPost = _jobPostService.CreateJobPost(dto, userId.Value);

            if (jobPost == null) return BadRequest("Could not create job post.");

            return Ok(jobPost);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Employer")]
        public IActionResult UpdateJobPost(int id, [FromBody] UpdateJobPostDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var jobPost = _jobPostService.UpdateJobPost(id, dto, userId.Value);

            if (jobPost == null)
                return NotFound("Job post not found or you don't have permission.");

            return Ok(jobPost);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Employer")]
        public IActionResult DeleteJobPost(int id)
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            var result = _jobPostService.DeleteJobPost(id, userId.Value);

            if (!result)
                return NotFound("Job post not found or you don't have permission.");

            return Ok("Job post deleted successfully.");
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
