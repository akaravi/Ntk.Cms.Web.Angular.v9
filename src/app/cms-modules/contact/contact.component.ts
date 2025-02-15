import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-contact',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class ContactComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
