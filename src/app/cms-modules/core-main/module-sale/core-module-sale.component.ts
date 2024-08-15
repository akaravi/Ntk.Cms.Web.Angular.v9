import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-module-sale',
  template: '<router-outlet></router-outlet>',
})
export class CoreModuleSaleComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
