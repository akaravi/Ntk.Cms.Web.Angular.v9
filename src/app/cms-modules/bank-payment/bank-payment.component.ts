import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-bankpayment',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class BankPaymentComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor() { }
  ngOnInit(): void {
  }
}
