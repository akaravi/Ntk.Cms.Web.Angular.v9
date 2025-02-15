import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-core-user-support-access',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class CoreUserSupportAccessComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
