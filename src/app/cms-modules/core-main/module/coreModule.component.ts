import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-core-module',
  template: '<router-outlet></router-outlet>',
  standalone: false
})
export class CoreModuleComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
