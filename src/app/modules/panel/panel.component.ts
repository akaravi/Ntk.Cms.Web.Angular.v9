import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  env = environment;
  constructor() { }

  ngOnInit(): void {

  }

  onDoubleClick(event: MouseEvent): void {
    const element = event.target as HTMLElement;
    element.classList.add('allow-select-text');

    // حذف کلاس بعد از 5 ثانیه
    setTimeout(() => {
      element.classList.remove('allow-select-text');
    }, 10000);
  }
}
