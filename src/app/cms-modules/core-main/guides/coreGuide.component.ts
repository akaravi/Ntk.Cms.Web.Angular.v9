import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-core-guide',
  template: '<router-outlet></router-outlet>',
  standalone: false
})
export class CoreGuideComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
