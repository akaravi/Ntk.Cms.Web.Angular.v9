import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-core-module-entity',
  template: '<router-outlet></router-outlet>',
})
export class CoreModuleEntityComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
