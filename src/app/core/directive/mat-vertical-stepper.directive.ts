import { Directive, HostListener } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Directive({
    selector: 'mat-vertical-stepper',
    standalone: false
})
export class MatVerticalStepperScrollerDirective {
  constructor(private stepper: MatStepper) { }

  @HostListener('animationDone')
  selectionChanged() {
    const stepId = this.stepper._getStepLabelId(this.stepper.selectedIndex);
    const stepElement = document.getElementById(stepId);
    if (stepElement) {
      stepElement.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
    }
  }
}
