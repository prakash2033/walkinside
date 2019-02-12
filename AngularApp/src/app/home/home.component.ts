import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { HubConnection, HubConnectionBuilder } from "@aspnet/signalr";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public team: any;
  public hubConnection: HubConnection;
  public userName: string = ''; 
  public teamName: string = ''; // key
  public clientConnectionId:string='';
  timeLeft: number = 120;
  interval;

  avatarForm: FormGroup;
  avatarStr:string = "";
  submitted = false;
  success:boolean = false;
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.avatarStr = "assets/avatars/Kid-icon.png";
   }

  ngOnInit() {
    this.route.params.subscribe(p=>{
      this.teamName = p['scrumTeam'];
    });
    this.avatarForm = this.formBuilder.group({
      userName: ['', Validators.required]
    });

    // Create Connection
    this.hubConnection = new HubConnectionBuilder().withUrl("https://localhost:44314/scrum").build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));
      
      this.hubConnection.on('Team', (data: any) => {
        this.team = data; // Scrum Team (Group)
        //console.log(this.team);
      });
      
  }
  
  selectAvatar(avatarName:any): void {
    this.avatarStr = 'assets/avatars/' + avatarName + '.png';
    console.log(this.avatarStr);
  }

  // Create or Join
  onSubmit(avatarForm:any):void{
    
    this.submitted = true;
    if (this.avatarForm.invalid) {
      return;
    }
    this.success=true;

    
    console.log(avatarForm.controls.userName.value);
    console.log(this.avatarStr);

    // Call CreateOrJoin
    this.hubConnection.invoke('CreateOrJoinScrum', this.teamName,
      avatarForm.controls.userName.value, this.avatarStr);
    //this.router.navigate(['/scrum',avatarForm.controls.teamName.value])

    this.GetAndStoreConnectionId();
  }

  // Start
  StartScrum(){
    this.hubConnection.invoke('StartScrum');
  }

  GrabBall(){
    this.hubConnection.invoke('GrabBall');
  }

  Speak(connectionId:string){
    this.hubConnection.invoke('Speak', connectionId);
  }

  GetAndStoreConnectionId(){
    let self = this
    this.hubConnection.invoke<string>('GetConnectionId')
    .then(function (connectionId:string) {
      self.clientConnectionId = connectionId;
      localStorage.setItem('connectionId', self.clientConnectionId);
      console.log(connectionId);
    });
  }
}
