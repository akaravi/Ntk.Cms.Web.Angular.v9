import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-core-main-action',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class CoreMainActionComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
