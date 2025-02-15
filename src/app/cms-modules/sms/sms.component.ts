import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-sms',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class SmsComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
