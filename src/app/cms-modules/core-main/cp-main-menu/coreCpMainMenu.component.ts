import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-core-user',
  template: '<router-outlet></router-outlet>',
})
export class CoreCpMainMenuComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
