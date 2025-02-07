import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-coremodulelog',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class CoreModuleLogComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
