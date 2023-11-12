import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  @HostBinding('class') class = 'd-flex flex-column flex-root';
  constructor(private router: Router) { }

  ngOnInit(): void { }

  routeToDashboard() {
    this.router.navigate(['dashboard']);
    // setTimeout(() => {
    //   ToggleComponent.bootstrap();
    //   ScrollTopComponent.bootstrap();
    //   DrawerComponent.bootstrap();
    //   StickyComponent.bootstrap();
    //   MenuComponent.bootstrap();
    //   ScrollComponent.bootstrap();
    // }, 200);
  }
}
