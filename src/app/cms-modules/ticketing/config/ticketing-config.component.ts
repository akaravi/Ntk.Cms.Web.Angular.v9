import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ticketing-config',
  template: '<router-outlet></router-outlet>',
})
export class TicketingConfigComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
