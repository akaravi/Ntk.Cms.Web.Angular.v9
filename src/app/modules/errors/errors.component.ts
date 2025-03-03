import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-errors',
    templateUrl: './errors.component.html',
    styleUrls: ['./errors.component.scss'],
    standalone: false
})
export class ErrorsComponent implements OnInit {
  @HostBinding('class') class = 'd-flex flex-column flex-root';
  env = environment;
  constructor(private router: Router) { }

  ngOnInit(): void { }

  routeToDashboard() {
    this.router.navigate(['dashboard']);
  }
}
