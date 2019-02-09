using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using walkinside.webapi.signalr.Models;

namespace walkinside.webapi.signalr.Hubs
{
    public class ScrumHub : Hub
    {
        private static List<ScrumTeam> _teams = new List<ScrumTeam>();

        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (_teams.Any(t => t.ScrumMaster == Context.ConnectionId))
            {
                var connectedTeams = _teams.Where(t => t.ScrumMaster == Context.ConnectionId).ToList();
                foreach (var team in connectedTeams)
                {
                    BroadcastScrumTeam(team, true);
                    connectedTeams.Remove(team);
                }
                //for(int i=0; i < connectedTeams.Count; i++) // Switch to for loop if foreach doesn't work
            }
            return base.OnDisconnectedAsync(exception);
        }

        public void CreateOrJoinScrum(string key, string userName, string userImageName)
        {
            var team = _teams.FirstOrDefault(t => t.Key == key);
            if (team == null)
            {
                // ScrumMaster is the owner of Scrum
                team = new ScrumTeam { Key = key, ScrumMaster = Context.ConnectionId };
                _teams.Add(team);
            }
            if (team.ScrumFinished || team.ScrumStarted)
            {
                throw new Exception("You cannot join a team which has started or finished");
            }

            team.ScrumMembers.Add(new ScrumMember { ConnectionId = Context.ConnectionId, Username = userName, UserImageName = userImageName });
            BroadcastScrumTeam(team);
        }

        public void StartScrum()
        {
            var team = _teams.FirstOrDefault(t => t.ScrumMaster == Context.ConnectionId && !t.ScrumFinished && !t.ScrumStarted);
            if (team != null)
            {
                // Broadcast scrum team that scrum has started
                team.ScrumStarted = true;
                BroadcastScrumTeam(team);
            }
        }

        public void Speak()
        {
            var team = _teams.FirstOrDefault(t => !t.ScrumFinished && t.ScrumStarted && t.ScrumMembers.Any(sm => sm.ConnectionId == Context.ConnectionId));
            if (team != null)
            {
                var scrumMember = team.ScrumMembers.First(sm => sm.ConnectionId == Context.ConnectionId);
                if (scrumMember != null)
                {
                    // Mark this scrum member as spoken
                    scrumMember.Spoken = true;
                }
                BroadcastScrumTeam(team);

                var thoseWhoNotSpokeYet = team.ScrumMembers.First(sm => sm.Spoken == false);
                if(thoseWhoNotSpokeYet == null)
                {
                    // Everybody spoke scrum is over
                    team.ScrumFinished = true;
                    _teams.Remove(team);
                }
            }
        }

        private void BroadcastScrumTeam(ScrumTeam team, bool removing = false)
        {
            var clients = team.ScrumMembers.Select(t => t.ConnectionId).ToList();
            Clients.Clients(clients).SendAsync("Team", removing ? null : team);
        }
    }
}
