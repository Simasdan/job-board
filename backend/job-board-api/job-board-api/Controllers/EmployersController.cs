using Asp.Versioning;
using job_board_api.Data.DTOs;
using job_board_api.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace job_board_api.Controllers
{
    [Route("api/v{version:apiVersion}/employers")]
    [ApiController]
    [ApiVersion("1.0")]
    public class EmployersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("my-profile")]
        [Authorize(Roles = "Employer")]
        public IActionResult GetMyProfile()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var profile = _context.Employers.FirstOrDefault(e => e.UserId == userId);
            if (profile == null) return NotFound();

            return Ok(profile);
        }

        [HttpPut("my-profile")]
        [Authorize(Roles = "Employer")]
        public IActionResult UpdateMyProfile([FromBody] UpdateEmployerProfileDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var profile = _context.Employers.FirstOrDefault(e => e.UserId == userId);
            if (profile == null) return NotFound();

            profile.CompanyName = dto.CompanyName;
            profile.CompanyDescription = dto.CompanyDescription;
            profile.Website = dto.Website;

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