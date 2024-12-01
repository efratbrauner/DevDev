using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DevDevApi.Models
{
    public class ApiKey
    {
        public Guid Id { get; set; }
        public string JwtToken { get; set; }
        public string UserId { get; set; }
        public List<string> Permissions { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastUsed { get; set; }
        public bool IsRevoked { get; set; }
    }
}
