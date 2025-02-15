import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-apitelegram-config',
  template: '<router-outlet></router-outlet>',
})
export class ApiTelegramConfigComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
