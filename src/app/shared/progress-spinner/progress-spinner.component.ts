import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { ProcessModel } from 'src/app/core/models/processModel';
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
    private cdr: ChangeDetectorRef,
  ) {
    this.processService.cdr = this.cdr;
    processService.processSubject.subscribe((value) => {
      this.process = processService.processSubject.value;
    });
  }
  @Input() optionsInfoAreaId: string = 'global';

  process: ProcessModel;

  ngOnInit(): void {

  }
}
