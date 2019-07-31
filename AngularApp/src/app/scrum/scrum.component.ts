import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType } from "@aspnet/signalr";
import { NavbarComponent } from '../navbar/navbar.component';
import {HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-scrum',
  templateUrl: './scrum.component.html',
  styleUrls: ['./scrum.component.scss']
})
export class ScrumComponent implements OnInit {

  public team: any;
  public hubConnection: HubConnection;
  public userName: string = '';
  public teamName: string = ''; // key
  public clientConnectionId: string = '';
  public avatarImages = ['assets/avatars/Angel-icon.png',
    'assets/avatars/Clown-icon.png',
    'assets/avatars/Dad-icon.png',
    'assets/avatars/Girl-icon.png',
    'assets/avatars/Kid-icon.png',
    'assets/avatars/Knight-icon.png',
    'assets/avatars/Lawyer-icon.png',
    'assets/avatars/Leprechaun-icon.png',
    'assets/avatars/Man-icon.png',
    'assets/avatars/Mermaid-icon.png',
    'assets/avatars/Monster-icon.png',
    'assets/avatars/Ninja-icon.png',
    'assets/avatars/Pirate-icon.png',
    'assets/avatars/Princess-icon.png',
    'assets/avatars/Robot-icon.png',
    'assets/avatars/Superhero-icon.png',
    'assets/avatars/Teacher-icon.png',
    'assets/avatars/Troll-icon.png',
    'assets/avatars/Vampire-icon.png',
    'assets/avatars/Zombie-icon.png']
  public isBallHolder: boolean;
  public fibSeries = [];
  public selectedPoker;
  avatarForm: FormGroup;
  avatarStr: string = "";
  submitted = false;
  success: boolean = false;
  public isPokerEnable  = false;
  public isShowVote = false;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {
    var rnd = Math.floor((Math.random() * this.avatarImages.length - 1) + 1);
    this.avatarStr = this.avatarImages[rnd];
  }

  ngOnInit() {
    this.route.params.subscribe(p => {
      if (p['scrumTeam'] != null) {
        this.teamName = p['scrumTeam'];
      }
      else {
        this.router.navigate(['/scrum/walkinside']);
      }
    });
    this.avatarForm = this.formBuilder.group({
      userName: ['', Validators.required]
    });

    // Create Connection



 const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');


    this.hubConnection = new HubConnectionBuilder().withUrl("https://localhost:44314/scrum")
      //this.hubConnection = new HubConnectionBuilder().withUrl("http://walkinsidescrumwebapi.azurewebsites.net/scrum")
      .configureLogging(LogLevel.Debug)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch((err) => {
        console.log('Error while establishing connection :(' + err);
      });

    this.hubConnection.on('Team', (data: any) => {
      this.team = data; // Scrum Team (Group)
      console.log(this.team);
    });

    this.getFibonacci();

  }

  togglePoker(){
    this.team.isPokerEnabled = !this.team.isPokerEnabled;
    this.TogglePoker();
  }

  getFibonacci() {
    let i;

    this.fibSeries[0] = '?';
    this.fibSeries[1] = 1;
    this.fibSeries[2] = 1;

    for (i = 3; i <= 10; i++) {
      this.fibSeries[i] = this.fibSeries[i - 2] + this.fibSeries[i - 1];
    }
  }

  selectPokerNumber(event: Event){

    let scrumMember = this.team.scrumMembers.filter(x=> x.connectionId === this.clientConnectionId);
    scrumMember[0].pokerPoint = (event.currentTarget as Element).innerHTML;

    this.SelectPoker();
  }



  selectAvatar(avatarPath: any): void {
    this.avatarStr = avatarPath;
    console.log(this.avatarStr);
  }

  // Create or Join
  onSubmit(avatarForm: any): void {

    this.submitted = true;
    if (this.avatarForm.invalid) {
      return;
    }
    this.success = true;

    console.log('username: ' + avatarForm.controls.userName.value);
    console.log('image selected: ' + this.avatarStr);

    // Call CreateOrJoin
    this.hubConnection.invoke('CreateOrJoinScrum', this.teamName,
      avatarForm.controls.userName.value, this.avatarStr);

    this.GetAndStoreConnectionId();
  }

  // Get And StoreConnectionId
  GetAndStoreConnectionId() {
    let self = this
    this.hubConnection.invoke<string>('GetConnectionId')
      .then(function (connectionId: string) {
        self.clientConnectionId = connectionId;
        localStorage.setItem('connectionId', self.clientConnectionId);
        console.log('your connection id: ' + connectionId);
      });
  }

  // Start
  StartScrum() {
    this.hubConnection.invoke('StartScrum');
  }

  TogglePoker(){
    this.hubConnection.invoke('TogglePoker',this.teamName,this.team.isPokerEnabled);
  }

  showVote(){
    this.hubConnection.invoke('ShowVote',this.teamName,true);
  }

  clearVote(){
    this.hubConnection.invoke('ClearVote',this.teamName,false);
  }

  // GrabBall
  GrabBall() {
    this.hubConnection.invoke('GrabBall');
  }

  Speak(connectionId: string) {
    this.hubConnection.invoke('Speak', connectionId);
  }

  SelectPoker(){
    let scrumMember = this.team.scrumMembers.filter(x=> x.connectionId === this.clientConnectionId);

    this.hubConnection.invoke('StartPoker',this.teamName,
    this.avatarForm.controls.userName.value, scrumMember[0].pokerPoint);
  }

  // ClearPoker(){
  //   this.hubConnection.invoke('ClearPoker',this.teamName);
  // }
}
