import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-coremoduledata',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class CoreModuleDataComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
