import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-corelog',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class CoreLogComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
