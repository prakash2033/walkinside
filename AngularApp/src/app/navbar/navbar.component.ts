import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public isPokerEnable = false;
  constructor() { }

  ngOnInit() {
    this.isPokerEnable = false;
  }

  togglePoker(){
    this.isPokerEnable = !this.isPokerEnable;
  }
}
