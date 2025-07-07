﻿using DailyTaskPlaner.Business.Services.Interfaces;
using DailyTaskPlaner.Common;
using DailyTaskPlaner.Common.DTOs;
using DailyTaskPlaner.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DailyTaskPlaner.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly IUsersService _usersService;

    public UsersController(IUsersService usersService)
    {
        _usersService = usersService;
    }


    [HttpGet("get-all")]
    public async Task<IActionResult> GetAllUsers()
    {
        List<User> users = await _usersService.GetAllUsers();
        
        return Ok(users);
    }

    [HttpGet("Search_user")]
    public async Task<IActionResult> SearchUser([FromQuery] string? username, [FromQuery] string? email)
    {
        if (string.IsNullOrWhiteSpace(username) && string.IsNullOrWhiteSpace(email))
        {
            return BadRequest("You must provide either a username or an email.");
        }

        var user = await _usersService.SearchUserAsync(username, email);

        if (user == null)
        {
            return NotFound("User not found.");
        }

        return Ok(user);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        User? user = await _usersService.GetUserAsync(id);

        if (user is null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpPost("create")]
    public async Task<IActionResult> Post([FromBody] CreateUserDto newUser)
    {
        if (string.IsNullOrEmpty(newUser.Email))
        {
            return BadRequest("Email required");
        }

        if (string.IsNullOrEmpty(newUser.Username))
        {
            return BadRequest("Username required");
        }

        ResultPackage<User> response = await _usersService.CreateUserAsync(newUser);
        
        if (response.Status == ResultStatus.BadRequest)
        {
            return BadRequest(response.Message);
        }

        if (response.Status == ResultStatus.InternalServerError)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, 
                "An error occurred while processing your request.");
        }

        return Created($"api/users/{response.Data?.Id}", response.Data);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto updatedUser)
    {
        if (updatedUser == null || id <= 0)
        {
            return BadRequest("Invalid user data.");
        }

        var result = await _usersService.UpdateUserAsync(id, updatedUser);

        if (!result)
        {
            return NotFound($"User with ID {id} not found.");
        }

        return NoContent(); // 204 No Content – success
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser([FromQuery] int userId)
    {
        var user = await _usersService.GetUserAsync(userId);
        if (user == null)
            return NotFound();

        return Ok(user);
    }
}
