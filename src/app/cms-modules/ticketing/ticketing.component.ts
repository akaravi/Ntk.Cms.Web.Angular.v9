import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-ticketing',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class TicketingComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
