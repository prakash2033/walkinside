﻿using System.Collections.Generic;

namespace walkinside.webapi.signalr.Models
{
    public class ScrumTeam
    {
        public bool ScrumStarted{ get; set; }
        public bool IsPokerEnabled { get; set; }
        public bool ScrumFinished{ get; set; }
        public string Key{ get; set; }
        public string ScrumMaster{ get; set; }
        public List<ScrumMember> ScrumMembers { get; set; } = new List<ScrumMember>();
        public string ErrorMessage { get; set; }
        public bool firstTimeBallWithScrumMaster { get; set; }
        public bool IsShowVote { get; set; }
        public bool IsClearVote { get; set; }
    }
}
