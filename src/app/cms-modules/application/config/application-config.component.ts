import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-application-config',
  template: '<router-outlet></router-outlet>',
})
export class ApplicationConfigComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
