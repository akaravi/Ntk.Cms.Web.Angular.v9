import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-site',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class CoreDeviceComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
