using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using DevDevApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace DevDev.ApiKeyManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApiKeyController : ControllerBase
    {
        private static List<ApiKey> _apiKeyTokens = new List<ApiKey>();

        private string authenticateRequest(HttpContext context)
        {
            return Request.Headers.ContainsKey("X-User-Id")
                ? Request.Headers["X-User-Id"].FirstOrDefault()
                : null;
        }

        [HttpPost]
        public IActionResult CreateApiKey([FromBody] ApiKeyRequest request)
        {
            string userId = authenticateRequest(HttpContext);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var apiKey = GenerateApiKey(userId, request.Permissions);

            return Ok(new { apiKey = apiKey.Id });
        }

        [HttpPost("authenticate")]
        public IActionResult AuthenticateWithApiKey([FromBody] Guid apiKey)
        {
            var token = _apiKeyTokens.FirstOrDefault(t => t.Id == apiKey);
            if (token == null || token.IsRevoked)
                return Unauthorized();

            var jwtToken = GenerateJwtToken(token);

            token.JwtToken = jwtToken;
            token.LastUsed = DateTime.UtcNow;

            return Ok(new { token = jwtToken });
        }

        [HttpDelete("{id}")]
        public IActionResult RevokeApiKey([FromRoute]Guid id)
        {
            string userId = authenticateRequest(HttpContext);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
          
            var token = _apiKeyTokens.FirstOrDefault(t => t.Id == id && t.UserId == userId);
            if (token == null)
                return NotFound();

            token.IsRevoked = true;
            return Ok();
        }

        [HttpGet]
        public IActionResult GetUserTokens()
        {
            string userId = authenticateRequest(HttpContext);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var userTokens = _apiKeyTokens
                .Where(t => t.UserId == userId)
                .Select(t => new JwtTokenResponse
                {
                    Id = t.Id,
                    JwtToken = t.JwtToken,
                    Permissions = t.Permissions,
                    LastUsed = t.LastUsed,
                    IsRevoked = t.IsRevoked
                })
                .ToList();

            return Ok(userTokens);
        }

        private ApiKey GenerateApiKey(string userId, List<string> permissions)
        {
            var apiKey = new ApiKey
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Permissions = permissions,
                CreatedAt = DateTime.UtcNow,
                LastUsed = DateTime.UtcNow,
                IsRevoked = false
            };

            _apiKeyTokens.Add(apiKey);
            return apiKey;
        }

        private string GenerateJwtToken(ApiKey apiKeyToken)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("DevDevSecretKeyForJWTTokenGeneration"));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, apiKeyToken.UserId),
                new Claim("name", apiKeyToken.UserId),
                new Claim("permissions", string.Join(",", apiKeyToken.Permissions))
            };

            var token = new JwtSecurityToken(
                issuer: "DevDevApiKeyService",
                audience: "DevDevUsers",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRandomKey()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }
    }
}