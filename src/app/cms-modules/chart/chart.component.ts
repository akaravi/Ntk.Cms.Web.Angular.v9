import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-chart',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class ChartComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }
  ngOnInit(): void {
  }

}
