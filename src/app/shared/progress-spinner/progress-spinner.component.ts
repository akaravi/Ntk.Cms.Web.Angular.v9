import {
  OverlayConfig,
  OverlayRef
} from '@angular/cdk/overlay';
import {
  Component, DoCheck, Input,
  OnInit, TemplateRef, ViewChild, ViewContainerRef
} from '@angular/core';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { OverlayService } from '../overlay/overlay.service';
import { ProcessService } from 'src/app/core/services/process.service';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss'],
})
export class ProgressSpinnerComponent implements OnInit {
  static nextId = 0;
  id = ++ProgressSpinnerComponent.nextId;
  constructor(
    public processService: ProcessService,
  ) {
    this.processService.processInRun
  }
  @Input()  optionsInfoAreaId: string='global';
  ngOnInit(): void {

  }
}
