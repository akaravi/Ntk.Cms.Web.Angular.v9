import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-sms-log',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class SmsLogComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
