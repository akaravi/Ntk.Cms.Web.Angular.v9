import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sms-action',
  template: '<router-outlet></router-outlet>'
})
export class SmsActionComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
