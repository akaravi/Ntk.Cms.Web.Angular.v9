import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
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
    this.processService.cdr = cdr;
    this.processService.getOnChange().subscribe((value) => {
      console.log('###### S ######');
      console.log('change#', value);
      console.log('processInRun#', this.processService.processInRun);
      console.log('processInRunArea#', this.processService.processInRunArea);
      console.log('processInfoArea#', this.processService.processInfoArea);
      console.log('processInfoAll#', this.processService.processInfoAll);
      console.log('###### E ######');
      //this.cdr.detectChanges();
    });
  }
  @Input() optionsInfoAreaId: string = 'global';
  ngOnInit(): void {

  }
}
