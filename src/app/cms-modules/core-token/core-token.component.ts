import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-core-token',
  template: '<router-outlet></router-outlet>',
})
export class CoreTokenComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
