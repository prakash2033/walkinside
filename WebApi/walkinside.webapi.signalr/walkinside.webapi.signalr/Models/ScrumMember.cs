using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace walkinside.webapi.signalr.Models
{
    public class ScrumMember
    {
        public bool HasLeft { get; set; }

        public string ConnectionId { get; set; }

        public string Username { get; set; }

        public string UserImageName { get; set; }

        public int TimeInSeconds { get; set; } = 120;

        public bool Spoken { get; set; }
    }
}
