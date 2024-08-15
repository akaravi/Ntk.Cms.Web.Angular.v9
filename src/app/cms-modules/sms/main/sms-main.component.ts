import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sms-main',
  template: '<router-outlet></router-outlet>'
})
export class SmsMainComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
