using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;
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
                    _teams.Remove(team);
                }
            }
            return base.OnDisconnectedAsync(exception);
        }

        public void CreateOrJoinScrum(string key, string userName, string userImageName)
        {
            var team = _teams.FirstOrDefault(t => t.Key == key);
            if (team == null)
            {
                // Create and start scrum
                team = new ScrumTeam { Key = key, ScrumStarted = true };
                _teams.Add(team);
            }
            if (team.ScrumFinished)
            {
                team.ErrorMessage = "You cannot join a team which has finished";
            }

            // Join Scrum
            team.ScrumMembers.Add(new ScrumMember { ConnectionId = Context.ConnectionId, Username = userName, UserImageName = userImageName });
            BroadcastScrumTeam(team);
        }

        public void GrabBall()
        {
            // I'm the scrum master
            var team = _teams.FirstOrDefault(t => !t.ScrumFinished && t.ScrumStarted && t.ScrumMembers.Any(sm => sm.ConnectionId == Context.ConnectionId));
            if (team != null)
            {
                var scrumMember = team.ScrumMembers.FirstOrDefault(sm => sm.ConnectionId == Context.ConnectionId);
                if (scrumMember != null)
                {
                    scrumMember.IsScrumMaster = true;
                    scrumMember.IsConchHolder = true;
                    team.ScrumMaster = scrumMember.ConnectionId;
                }
            }
            var other = team.ScrumMembers.FirstOrDefault(sm => sm.ConnectionId != Context.ConnectionId && sm.IsScrumMaster == true && sm.IsConchHolder == true);
            if (other != null)
            {
                other.IsConchHolder = false;
                other.IsScrumMaster = false;
            }

            BroadcastScrumTeam(team);
        }

        public void Speak(string connectionId)
        {
            var team = _teams.FirstOrDefault(t => !t.ScrumFinished && t.ScrumStarted && t.ScrumMembers.Any(sm => sm.ConnectionId == Context.ConnectionId));
            if (team != null)
            {
                var scrumMember = team.ScrumMembers.FirstOrDefault(sm => sm.ConnectionId == Context.ConnectionId && sm.IsConchHolder == true);
                if (scrumMember != null)
                {
                    // Mark me spoken if i'm not a scrum master
                    scrumMember.IsConchHolder = false;
                    if (!scrumMember.IsConchHolder && !scrumMember.IsScrumMaster)
                    {
                        scrumMember.Spoken = true;
                    }

                    // If ball passed to scrum master
                    var selectedScrumMember = team.ScrumMembers.FirstOrDefault(f => f.ConnectionId == connectionId);
                    if (selectedScrumMember != null)
                    {
                        selectedScrumMember.IsConchHolder = true;
                        while(true)
                        {
                            if (selectedScrumMember.Spoken)
                                break;
                            if (selectedScrumMember.TimeInSeconds > 0)
                            {
                                selectedScrumMember.TimeInSeconds--;
                            }
                            else
                            {
                                selectedScrumMember.Spoken = true;
                                break;
                            }
                            BroadcastScrumTeam(team);
                            Thread.Sleep(1000);
                        }
                    }
                }
                else
                {
                    var theOneWhoClicked = team.ScrumMembers.FirstOrDefault(sm => sm.ConnectionId == Context.ConnectionId);
                    team.ErrorMessage = string.Format("{0}, you do not have a ball to pass", theOneWhoClicked.Username);
                }

                BroadcastScrumTeam(team);

                var thoseWhoNotSpokeYet = team.ScrumMembers.FirstOrDefault(sm => sm.Spoken == false);
                if (thoseWhoNotSpokeYet == null)
                {
                    // Everybody spoke scrum is over
                    team.ScrumFinished = true;
                    _teams.Remove(team);
                }
            }
        }

        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        private void BroadcastScrumTeam(ScrumTeam team, bool removing = false)
        {
            var clients = team.ScrumMembers.Select(t => t.ConnectionId).ToList();
            Clients.Clients(clients).SendAsync("Team", removing ? null : team);
            if (!string.IsNullOrEmpty(team.ErrorMessage))
                team.ErrorMessage = string.Empty;
        }
    }
}
