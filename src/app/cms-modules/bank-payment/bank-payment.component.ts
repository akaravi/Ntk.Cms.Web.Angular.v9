import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-bankpayment',
  template: '<router-outlet></router-outlet>',
})
export class BankPaymentComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor() { }
  ngOnInit(): void {
  }
}
