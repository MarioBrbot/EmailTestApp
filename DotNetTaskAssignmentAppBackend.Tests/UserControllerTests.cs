using Xunit;
using Moq;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using DotNetTaskAssignmentAppBackend.Controllers;
using DotNetTaskAssignmentAppBackend.Data;
using DotNetTaskAssignmentAppBackend.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using DotNetTaskAssignmentAppBackend.Models;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

public class UserControllerTests
{
    private readonly UserController _controller;
    private readonly AppDbContext _context;
    private readonly Mock<ILogger<UserController>> _loggerMock;


    public UserControllerTests()
    {
        _loggerMock = new Mock<ILogger<UserController>>();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "UserTestDb")
            .Options;
        _context = new AppDbContext(options);

        _context.Users.RemoveRange(_context.Users);
        _context.Emails.RemoveRange(_context.Emails);
        _context.SaveChanges();

        _context.Users.Add(new User { Id = 1, Username = "TestUser", Password = "TestPassword" });
        _context.Users.Add(new User { Id = 2, Username = "User", Password = "User" });
        _context.SaveChanges();

        var configurationMock = new Mock<IConfiguration>();
        configurationMock.SetupGet(config => config["Jwt:SecretKey"]).Returns("SECRET_KEY_CUSTOM_SECRET_KEY_CUSTOM_SECRET_KEY_CUSTOM");
        configurationMock.SetupGet(config => config["Jwt:Issuer"]).Returns("DotNetTaskAssignementApp");
        configurationMock.SetupGet(config => config["Jwt:Audience"]).Returns("AppAudience");

        _controller = new UserController(_context, configurationMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Login_ValidCredentials_ReturnsToken()
    {
        var loginDto = new UserLoginDto
        {
            Username = "TestUser",
            Password = "TestPassword"
        };

        var result = await _controller.Login(loginDto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, okResult.StatusCode);

        var response = Assert.IsType<LoginResponseDto>(okResult.Value);
        string token = response.Token;

        Assert.False(string.IsNullOrEmpty(token));

        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);

        Assert.Equal("TestUser", jwtToken.Claims.First(claim => claim.Type == "unique_name").Value);
        Assert.Equal("1", jwtToken.Claims.First(claim => claim.Type == "nameid").Value);
    }


    [Fact]
    public async Task Login_InvalidCredentials_ReturnsUnauthorized()
    {
        var loginDto = new UserLoginDto
        {
            Username = "TestUser",
            Password = "WrongPassword"
        };

        var result =  await _controller.Login(loginDto);

        var unauthorizedResult = Assert.IsType<UnauthorizedResult>(result);
        Assert.Equal(401, unauthorizedResult.StatusCode);
    }

    [Fact]
    public async Task Login_NonExistentUser_ReturnsUnauthorized()
    {
        var loginDto = new UserLoginDto
        {
            Username = "NonExistentUser",
            Password = "AnyPassword"
        };

        var result = await _controller.Login(loginDto);

        var unauthorizedResult = Assert.IsType<UnauthorizedResult>(result);
        Assert.Equal(401, unauthorizedResult.StatusCode);
    }

    [Fact]
    public async Task Login_NullCredentials_ReturnsBadRequest()
    {
        var loginDto = new UserLoginDto
        {
            Username = null,
            Password = null
        };

        _controller.ModelState.AddModelError("Username", "Required");
        _controller.ModelState.AddModelError("Password", "Required");

        var result = await _controller.Login(loginDto);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(400, badRequestResult.StatusCode);
    }

    [Fact]
    public async Task Login_EmptyCredentials_ReturnsBadRequest()
    {
        var loginDto = new UserLoginDto
        {
            Username = "",
            Password = ""
        };

        _controller.ModelState.AddModelError("Username", "Required");
        _controller.ModelState.AddModelError("Password", "Required");

        var result = await _controller.Login(loginDto);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(400, badRequestResult.StatusCode);
    }




}
