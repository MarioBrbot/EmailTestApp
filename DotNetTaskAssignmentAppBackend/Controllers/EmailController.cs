using DotNetTaskAssignmentAppBackend.Data;
using DotNetTaskAssignmentAppBackend.DTOs;
using DotNetTaskAssignmentAppBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using DotNetTaskAssignmentAppBackend.Validators;
using System.ComponentModel.DataAnnotations;
using System.Net.Mail;

namespace DotNetTaskAssignmentAppBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmailController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<EmailController> _logger;

        public EmailController(AppDbContext context, ILogger<EmailController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailDto emailDto)
        {
            if (emailDto == null)
            {
                return BadRequest("Email data cannot be null.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var CcEmailValidator = new CcEmailAddressesValidation() { };
            var ValidCcEmailAdressessResult = CcEmailValidator.IsValidCcString(emailDto.CcEmailAddresses);

            if (ValidCcEmailAdressessResult != ValidationResult.Success)
            {
                return BadRequest("Cc Email adresses are not valid.");
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim not found.");
            }

            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized("Invalid user ID claim.");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return Unauthorized("User not found.");
            }

            if (string.IsNullOrEmpty(emailDto.FromEmailAddress))
            {
                return BadRequest("From email address data cannot be null.");
            }

            try
            {
                var mailAddress = new MailAddress(emailDto.FromEmailAddress);
            }
            catch (FormatException)
            {
                return BadRequest("From email address data is not in email format.");
            }

            if (string.IsNullOrEmpty(emailDto.ToEmailAddress))
            {
                return BadRequest("To email address data cannot be null.");
            }

            try
            {
                var mailAddress = new MailAddress(emailDto.ToEmailAddress);
            }
            catch (FormatException)
            {
                return BadRequest("To email address data is not in email format.");
            }

            var email = new Email
            {
                FromEmailAddress = emailDto.FromEmailAddress,
                ToEmailAddress = emailDto.ToEmailAddress,
                CcEmailAddresses = emailDto.CcEmailAddresses,
                Subject = emailDto.Subject,
                Importance = emailDto.Importance,
                EmailContent = emailDto.EmailContent,
                SentDate = DateTime.UtcNow,
                UserId = userId 
            };

            _context.Emails.Add(email);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Email sent successfully." });
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetEmailHistory()
        {
                 var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim not found.");
            }

            int userId;
            if (!int.TryParse(userIdClaim.Value, out userId))
            {
                return Unauthorized("Invalid user ID claim.");
            }

            var emails = await _context.Emails
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.SentDate)
                .ToListAsync();

            return Ok(emails);
        }
    }

}
