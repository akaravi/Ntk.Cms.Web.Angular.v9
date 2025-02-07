import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-coremodule',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class CoreModuleComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
