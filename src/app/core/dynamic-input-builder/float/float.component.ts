import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-input-float',
    templateUrl: './float.component.html',
    styleUrls: ['./float.component.scss'],
    standalone: false
})
export class FloatComponent implements OnInit {
  static nextId = 0;
  id = ++FloatComponent.nextId;
  constructor() { }
  @Input()
  set model(value: number) {
    this.privateModelDate = value;
  }
  @Output() modelChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() optionValueMin: number = null;
  @Input() optionValueMax: number = null;
  @Input() optionRequired = false;
  @Input() optionDisabled = false;
  @Input() optionLabel = '';
  @Input() optionPlaceholder = '';


  private privateModelDate: number;
  get modelDate(): number {
    return this.privateModelDate;
  }
  set modelDate(value: number) {
    if (this.optionValueMin && value < this.optionValueMin) {
      value = this.optionValueMin;
    }
    if (this.optionValueMax && value > this.optionValueMax) {
      value = this.optionValueMax;
    }
    this.privateModelDate = value;
    this.modelChange.emit(value);
  }
  ngOnInit(): void {
  }


}
