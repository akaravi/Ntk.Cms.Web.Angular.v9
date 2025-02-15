import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-filemanager',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class FileManagerComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor() {
  }

  ngOnInit(): void {
  }

}
