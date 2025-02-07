import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-sms-main',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class SmsMainComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
