import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-core-usergroup',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class CoreUserGroupComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
