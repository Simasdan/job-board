using Asp.Versioning;
using job_board_api.Data.DTOs;
using job_board_api.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace job_board_api.Controllers
{
    [Route("api/v{version:apiVersion}/candidates")]
    [ApiController]
    [ApiVersion("1.0")]
    public class CandidatesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CandidatesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("my-profile")]
        [Authorize(Roles = "Candidate")]
        public IActionResult GetMyProfile()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var profile = _context.Candidates.FirstOrDefault(c => c.UserId == userId);
            if (profile == null) return NotFound();

            return Ok(profile);
        }

        [HttpPut("my-profile")]
        [Authorize(Roles = "Candidate")]
        public IActionResult UpdateMyProfile([FromBody] UpdateCandidateProfileDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var profile = _context.Candidates.FirstOrDefault(c => c.UserId == userId);
            if (profile == null) return NotFound();

            profile.FullName = dto.FullName;
            profile.Bio = dto.Bio;
            profile.ResumeUrl = dto.ResumeUrl;

            _context.SaveChanges();

            return Ok(profile);
        }

        private int? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out var userId))
                return userId;
            return null;
        }
    }
}