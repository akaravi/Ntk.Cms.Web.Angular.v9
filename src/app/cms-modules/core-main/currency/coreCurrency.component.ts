import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-core-currency',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class CoreCurrencyComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
