import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-core-config',
  template: '<router-outlet></router-outlet>',
})
export class BankPaymentConfigComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }
  ngOnInit(): void {
  }
}
