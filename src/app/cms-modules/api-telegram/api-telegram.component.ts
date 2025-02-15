import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-apitelegram',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class ApiTelegramComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() { }

  ngOnInit(): void {
  }

}
