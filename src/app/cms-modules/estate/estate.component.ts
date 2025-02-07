import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-estate',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class EstateComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
