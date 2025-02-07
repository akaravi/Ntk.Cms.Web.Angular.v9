import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-core-userclaim',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class CoreUserClaimComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
