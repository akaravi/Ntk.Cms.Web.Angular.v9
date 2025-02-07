import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-core-user',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class CoreUserComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
