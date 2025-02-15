import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-member',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class MemberComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor() { }
  ngOnInit(): void {
  }
}
