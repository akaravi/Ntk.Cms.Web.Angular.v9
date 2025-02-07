import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-site',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class CoreSiteCategoryCmsModuleComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
