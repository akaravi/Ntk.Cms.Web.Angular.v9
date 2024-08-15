import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';
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
    this.process$ = processService.processSubject;//.getState(x => x..processInfoStore);
  }
  @Input() optionsInfoAreaId: string = 'global';

  process$: Observable<ProcessModel>;

  ngOnInit(): void {
    this.processService.getProcessInfoOnChange().subscribe((value) => {
      console.log('*******************getProcessInfoOnChange************************************************************************************************', value);
    })
    this.processService.getState().subscribe((value) => {
      console.log('********************getState***********************************************************************************************', value);
    })
  }
}
