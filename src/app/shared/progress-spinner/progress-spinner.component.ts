import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { ProcessInfoModel } from 'ntk-cms-api';
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
      this.infoArea = value.infoArea[this.optionsInfoAreaId];
      this.inRunArea = value.inRunArea[this.optionsInfoAreaId];
      console.log("infoArea", this.infoArea);
    });
  }
  @Input() optionsInfoAreaId: string = 'global';
  inRunArea: boolean[] = [];
  infoArea: Map<string, ProcessInfoModel>[] = [];
  ngOnInit(): void {

  }
}
