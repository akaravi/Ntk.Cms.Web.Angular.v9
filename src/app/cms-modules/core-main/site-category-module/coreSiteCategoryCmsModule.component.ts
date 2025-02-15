import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-core-sitecategorycmsmodule',
  template: '<router-outlet></router-outlet>',
})
export class CoreSiteCategoryCmsModuleComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
