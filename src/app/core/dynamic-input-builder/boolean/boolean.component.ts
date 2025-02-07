import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-input-boolean',
    templateUrl: './boolean.component.html',
    styleUrls: ['./boolean.component.scss'],
    standalone: false
})
export class BooleanComponent implements OnInit {
  static nextId = 0;
  id = ++BooleanComponent.nextId;
  constructor() { }
  @Input() optionDisabled = false;
  @Input() optionLabel = '';
  @Input() set model(val: any) {
    if (val && (val === true || val === 'true' || val === 1 || val === '1')) {
      this.isChecked = true;
    }
  }
  @Output() modelChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  isChecked = false;
  ngOnInit(): void {
  }
  setValueToggle(event: any): void {
    if (event === 'true') {
      this.isChecked = true;
      this.modelChange.emit(true);
    } else {
      this.isChecked = false;
      this.modelChange.emit(false);
    }
  }
}
