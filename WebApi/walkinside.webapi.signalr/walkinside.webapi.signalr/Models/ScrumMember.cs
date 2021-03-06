﻿namespace walkinside.webapi.signalr.Models
{
    public class ScrumMember
    {
        public bool IsScrumMaster { get; set; }

        public bool IsConchHolder { get; set; }

        public string ConnectionId { get; set; }

        public string Username { get; set; }

        public string UserImageName { get; set; }

        public int TimeInSeconds { get; set; } = 120;

        public bool Spoken { get; set; }
        public string PokerPoint { get; set; }
        
    }
}
