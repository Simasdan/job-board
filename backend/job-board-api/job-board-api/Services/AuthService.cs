using job_board_api.Data.DTOs;
using job_board_api.Data.Enums;
using job_board_api.Data.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace job_board_api.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public AuthResponseDto? Register(RegisterDto dto)
        {
            if (_context.Users.Any(u => u.Email == dto.Email))
            {
                return null;
            };

            if (!Enum.TryParse<Role>(dto.Role, true, out var role))
            {
                return null;
            };

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = role
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            if (role == Role.Candidate)
            {
                _context.Candidates.Add(new CandidateProfile
                {
                    UserId = user.Id,
                    FullName = dto.FullName ?? string.Empty,
                    Bio = dto.Bio ?? string.Empty
                });
            } 
            else if (role == Role.Employer)
            {
                _context.Employers.Add(new EmployerProfile
                {
                    UserId = user.Id,
                    CompanyName = dto.CompanyName ?? string.Empty,
                    CompanyDescription = dto.CompanyDescription ?? string.Empty,
                    Website = dto.Website ?? string.Empty
                });
            }

            _context.SaveChanges();

            return new AuthResponseDto
            {
                Token = GenerateToken(user),
                Email = user.Email,
                Role = user.Role.ToString()
            };
        }

        public AuthResponseDto? Login(LoginDto dto)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return null;
            }

            return new AuthResponseDto
            {
                Token = GenerateToken(user),
                Email = user.Email,
                Role = user.Role.ToString()
            };
        }

        private string GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]!)
            );
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
