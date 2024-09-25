
using Xunit;
using Moq;
using Microsoft.Extensions.Logging;
using DotNetTaskAssignmentAppBackend.Controllers;
using DotNetTaskAssignmentAppBackend.Data;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using DotNetTaskAssignmentAppBackend.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Collections.Generic;
using System.Security.Principal;
using Microsoft.AspNetCore.Authentication;
using DotNetTaskAssignmentAppBackend.Models;

public class EmailControllerTests
{
    private readonly Mock<ILogger<EmailController>> _loggerMock;
    private readonly EmailController _controller;
    private readonly AppDbContext _context;

    public EmailControllerTests()
    {
        _loggerMock = new Mock<ILogger<EmailController>>();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "EmailTestDb")
            .Options;
        _context = new AppDbContext(options);

        _context.Users.RemoveRange(_context.Users);
        _context.Emails.RemoveRange(_context.Emails);
        _context.SaveChanges();

        _context.Users.Add(new User { Id = 1, Username = "TestUser", Password = "TestPassword" });
        _context.SaveChanges();

        _controller = new EmailController(_context, _loggerMock.Object);

        var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.NameIdentifier, "1"),
            new Claim(ClaimTypes.Name, "TestUser")
        }, "TestAuthentication"));

        _controller.ControllerContext = new ControllerContext()
        {
            HttpContext = new DefaultHttpContext() { User = user }
        };
    }

    [Fact]
    public async Task SendEmail_ValidData_ReturnsOk()
    {
        var emailDto = new EmailDto
        {
            FromEmailAddress = "sender@example.com",
            ToEmailAddress = "recipient@example.com",
            Subject = "Test Email",
            CcEmailAddresses = "",
            Importance = "Normal",
            EmailContent = "This is a test email."
            
        };

        var result = await _controller.SendEmail(emailDto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, okResult.StatusCode);
    }

    [Fact]
    public async Task SendEmail_InvalidModel_ReturnsBadRequest()
    {
        var emailDto = new EmailDto(); 

        _controller.ModelState.AddModelError("FromEmailAddress", "Required");

        var result = await _controller.SendEmail(emailDto);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(400, badRequestResult.StatusCode);
    }

    [Fact]
    public async Task SendEmail_UserNotFound_ReturnsUnauthorized()
    {
        _context.Users.RemoveRange(_context.Users);
        _context.SaveChanges();

        var emailDto = new EmailDto
        {
            FromEmailAddress = "sender@example.com",
            ToEmailAddress = "recipient@example.com",
            Subject = "Test Email",
            Importance = "Normal",
            EmailContent = "This is a test email."
        };

        var result = await _controller.SendEmail(emailDto);

        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal(401, unauthorizedResult.StatusCode);
        Assert.Equal("User not found.", unauthorizedResult.Value);
    }

    [Fact]
    public async Task SendEmail_MissingUserIdClaim_ReturnsUnauthorized()
    {

        _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
        {
        new Claim(ClaimTypes.Name, "TestUser")
        }, "TestAuthentication"));

        var emailDto = new EmailDto
        {
            FromEmailAddress = "sender@example.com",
            ToEmailAddress = "recipient@example.com",
            Subject = "Test Email",
            Importance = "Normal",
            EmailContent = "This is a test email."
        };

        var result = await _controller.SendEmail(emailDto);

        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal(401, unauthorizedResult.StatusCode);
        Assert.Equal("User ID claim not found.", unauthorizedResult.Value);
    }

    [Fact]
    public async Task SendEmail_InvalidUserIdClaim_ReturnsUnauthorized()
    {
        _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
        {
        new Claim(ClaimTypes.NameIdentifier, "invalid"),
        new Claim(ClaimTypes.Name, "TestUser")
        }, "TestAuthentication"));

        var emailDto = new EmailDto
        {
            FromEmailAddress = "sender@example.com",
            ToEmailAddress = "recipient@example.com",
            Subject = "Test Email",
            Importance = "Normal",
            EmailContent = "This is a test email."
        };

        var result = await _controller.SendEmail(emailDto);

        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal(401, unauthorizedResult.StatusCode);
        Assert.Equal("Invalid user ID claim.", unauthorizedResult.Value);
    }


    [Fact]
    public async Task SendEmail_NullEmailDto_ReturnsBadRequest()
    {
        var result = await _controller.SendEmail(null);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(400, badRequestResult.StatusCode);
        Assert.Equal("Email data cannot be null.", badRequestResult.Value);
    }

    [Fact]
    public async Task GetEmailHistory_ValidRequest_ReturnsOk()
    {
        _context.Emails.Add(new Email
        {
            FromEmailAddress = "sender@example.com",
            ToEmailAddress = "recipient@example.com",
            Subject = "Test Email",
            Importance = "Normal",
            CcEmailAddresses = "",
            EmailContent = "This is a test email.",
            SentDate = DateTime.UtcNow,
            UserId = 1
        });
        _context.SaveChanges();

        var result = await _controller.GetEmailHistory();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, okResult.StatusCode);
        var emails = Assert.IsAssignableFrom<List<Email>>(okResult.Value);
        Assert.Single(emails);
    }

    [Fact]
    public async Task GetEmailHistory_NoEmails_ReturnsOkWithEmptyList()
    {
        var result = await _controller.GetEmailHistory();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, okResult.StatusCode);
        var emails = Assert.IsAssignableFrom<List<Email>>(okResult.Value);
        Assert.Empty(emails);
    }

}
