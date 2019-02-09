import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  avatarForm: FormGroup;
  avatarStr:string = "";
  submitted = false;
  success:boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.avatarStr = "assets/avatars/Kid-icon.png";
   }

  ngOnInit() {
    this.avatarForm = this.formBuilder.group({
      userName: ['', Validators.required],
      teamName: ['', Validators.required]
    });
  }
  
  selectAvatar(avatarName:any): void {
    this.avatarStr = 'assets/avatars/' + avatarName + '.png';
    console.log(this.avatarStr);
  }

  onSubmit(avatarForm:any):void{
    
    this.submitted = true;
    if (this.avatarForm.invalid) {
      return;
    }
    this.success=true;
    
    console.log(avatarForm.controls.userName.value);
    console.log(avatarForm.controls.teamName.value);
    console.log(this.avatarStr);
    this.router.navigate(['/scrum', avatarForm.controls.userName.value, this.avatarStr, avatarForm.controls.teamName.value])
  }
}
