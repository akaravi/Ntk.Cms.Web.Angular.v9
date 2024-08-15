import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog',
  template: '<router-outlet></router-outlet>',
})
export class BlogComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
