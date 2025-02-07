import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-polling',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class PollingComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
