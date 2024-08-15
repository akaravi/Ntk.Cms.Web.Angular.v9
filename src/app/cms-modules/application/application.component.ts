import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-application',
  template: '<router-outlet></router-outlet>',
})
export class ApplicationComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
