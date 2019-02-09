import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-scrum',
  templateUrl: './scrum.component.html',
  styleUrls: ['./scrum.component.scss']
})
export class ScrumComponent implements OnInit {

  avatarStr:string;
  avatarImgSrc:string;
  constructor(private route: ActivatedRoute) {
    
   }

  ngOnInit() {
    this.route.params.subscribe(p=>{
      this.avatarStr = p['avatar'];
      this.avatarImgSrc = p['avatarSrc'];
    });
    console.log(this.avatarStr);
    console.log(this.avatarImgSrc);

  }

}
