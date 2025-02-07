import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-linkmanagement',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class LinkManagementComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
