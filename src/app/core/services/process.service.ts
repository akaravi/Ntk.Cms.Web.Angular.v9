
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ProcessInfoModel } from 'ntk-cms-api';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProcessModel } from '../models/processModel';
import { CmsStoreService } from '../reducers/cmsStore.service';
import { SET_Process_Info } from '../reducers/reducer.factory';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  constructor(
    public cmsStoreService: CmsStoreService,
  ) {
    this.process = new ProcessModel();
    const storeSnapshot = this.cmsStoreService.getStateSnapshot();
    if (storeSnapshot.processInfoStore) {
      this.process.infoAll = storeSnapshot.processInfoStore;
    }
    this.processSubject = new BehaviorSubject(this.process);
  }

  public cmsApiStoreSubscribe: Subscription;
  public cdr: ChangeDetectorRef;
  public processSubject: BehaviorSubject<ProcessModel>;
  public process: ProcessModel;

  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  public onInitAppComponent(): void {
    this.cmsApiStoreSubscribe = this.cmsStoreService.getState((state) => state.processInfoStore).subscribe((value) => {
      if (this.cdr) {
        //todo: karavi error
        try {
          setTimeout(() => this.cdr.detectChanges(), 100);
        } catch (error) {
          console.log('cdr error', error);
        }
      }
    });
  }

  getProcessInfoOnChange(): Observable<Map<string, ProcessInfoModel>> {
    return this.cmsStoreService.getState((state) => {
      if (environment.ProgressConsoleLog)
        console.log("getProcessInfoOnChange ");

      return state.processInfoStore;
    });
  }

  /*
  /process info
  /
  */
  public processStart(key: string, title: string = ' ', infoAreaId: string = 'global'): void {
    let model = new ProcessInfoModel();
    model.isComplate = false;
    model.title = title;
    model.infoAreaId = infoAreaId;
    if (environment.ProgressConsoleLog)
      console.log("#### processStart #### " + key + " " + JSON.stringify(model));

    /** processInRun */
    this.process.inRunAll = true;
    this.process.infoAll.set(key, model);
    if (!this.process.infoArea[model.infoAreaId])
      this.process.infoArea[model.infoAreaId] = new Map<string, ProcessInfoModel>();
    this.process.infoArea[model.infoAreaId].set(key, model);
    this.process.inRunArea[model.infoAreaId] = true;
    /** processInRun */
    setTimeout(() => {
      const aaa = this.process;
      if (environment.ProgressConsoleLog)
        console.log("value in processStart ", aaa)
      this.processSubject.next(aaa);
    }, 1);

    this.cmsStoreService.setState({ type: SET_Process_Info, payload: this.process.infoAll });
  }
  public processStop(key: string, isSuccess = true): void {
    var model = this.process.infoAll.get(key);
    if (!model) {
      model = new ProcessInfoModel();
      return;
    }
    model.isComplate = true;
    model.isSuccess = isSuccess;
    if (environment.ProgressConsoleLog)
      console.log("#### processStop #### " + key + " " + JSON.stringify(model));
    this.process.infoAll.set(key, model);
    this.process.infoArea[model.infoAreaId].set(key, model);
    /** processInRun */
    var retOutInRunAll = false;
    var retOutInRunArea = false;
    for (const [key, value] of this.process.infoAll) {
      if (value && value.isComplate === false) {
        retOutInRunAll = true;
      }
      if (value && value.isComplate === false && value.infoAreaId === model.infoAreaId) {
        retOutInRunArea = true;
      }
    }
    if (retOutInRunAll) {
      this.process.inRunAll = retOutInRunAll;
      this.process.inRunArea[model.infoAreaId] = retOutInRunArea;
      setTimeout(() => {
        const retValue = this.process;
        if (environment.ProgressConsoleLog)
          console.log("value in service ", retValue)
        this.processSubject.next(retValue);
      }, 1);
    } else {
      setTimeout(() => {
        this.process.inRunAll = retOutInRunAll;
        this.process.inRunArea[model.infoAreaId] = retOutInRunArea;
        const retValue = this.process;
        if (environment.ProgressConsoleLog)
          console.log("value in processStop ", retValue)
        this.processSubject.next(retValue);
      }, 1000);
    }
    /** processInRun */
    this.cmsStoreService.setState({ type: SET_Process_Info, payload: this.process.infoAll });
  }
  /*
  /process info
  /
  */
}
