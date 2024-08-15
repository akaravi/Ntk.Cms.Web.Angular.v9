
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { NtkCmsApiStoreService, ProcessInfoModel, SET_IN_PROCESSING_LIST } from 'ntk-cms-api';
import { BehaviorSubject, distinctUntilChanged, Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProcessModel } from '../models/processModel';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  constructor(
    private cmsApiStore: NtkCmsApiStoreService,
  ) {
    this.consoleLog = environment.ProgressConsoleLog;
    this.process = new ProcessModel();
    const storeSnapshot = this.cmsApiStore.getStateSnapshot();
    if (storeSnapshot.ntkCmsAPiState.processInfoStore) {
      this.process.infoAll = storeSnapshot.ntkCmsAPiState.processInfoStore;
    }
    this.processSubject = new BehaviorSubject(this.process);
  }
  consoleLog = true;
  public cmsApiStoreSubscribe: Subscription;
  public cdr: ChangeDetectorRef;
  public processSubject: BehaviorSubject<ProcessModel>;
  public process: ProcessModel;

  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  public onInitAppComponent(): void {
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.processInfoStore).subscribe((value) => {
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
    return this.cmsApiStore.getState((state) => {
      if (this.consoleLog)
        console.log("getProcessInfoOnChange ");
      console.log("getProcessInfoOnChange ");
      return state.ntkCmsAPiState.processInfoStore;
    });
  }
  getState(): Observable<ProcessModel> {
    console.log('********************getState***********************1111111111111111111******************************');

    return (this.processSubject.pipe(distinctUntilChanged()));
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
    if (this.consoleLog)
      console.log("#### processStart #### " + key + " " + JSON.stringify(model));
    this.process.infoAll.set(key, model);

    this.process.inRunAll = true;
    /** processInRun */
    var retOutProcessInRun = false;
    var retOutprocessInRunArea: boolean[] = [];
    var retOutProcessInfoArea: Map<string, ProcessInfoModel>[] = []
    for (const [key, value] of this.process.infoAll) {
      if (value && value.isComplate === false) {
        retOutProcessInRun = true;
        retOutprocessInRunArea[value.infoAreaId] = true;
      }
      if (!retOutProcessInfoArea[value.infoAreaId])
        retOutProcessInfoArea[value.infoAreaId] = new Map<string, ProcessInfoModel>();
      retOutProcessInfoArea[value.infoAreaId].set(key, value);
    }
    this.process.inRunAll = retOutProcessInRun;
    this.process.inRunArea = retOutprocessInRunArea;
    this.process.infoArea = retOutProcessInfoArea;
    /** processInRun */
    this.processSubject.next(this.process);
    this.cmsApiStore.setState({ type: SET_IN_PROCESSING_LIST, payload: this.process.infoAll });

  }
  public processStop(key: string, isSuccess = true): void {
    var model = this.process.infoAll.get(key);
    if (!model) {
      model = new ProcessInfoModel();
    }
    model.isComplate = true;
    model.isSuccess = isSuccess;
    this.process.infoAll.set(key, model);
    if (this.consoleLog)
      console.log("#### processStop #### " + key + " " + JSON.stringify(model));
    var retOutProcessInRun = false;
    for (const [key, value] of this.process.infoAll) {
      if (value && value.isComplate === false) {
        retOutProcessInRun = true;
      }
    }
    /** processInRun */
    var retOutProcessInRun = false;
    var retOutprocessInRunArea: boolean[] = [];
    var retOutProcessInfoArea: Map<string, ProcessInfoModel>[] = []
    for (const [key, value] of this.process.infoAll) {
      if (value && value.isComplate === false) {
        retOutProcessInRun = true;
        retOutprocessInRunArea[value.infoAreaId] = true;
      }
      if (!retOutProcessInfoArea[value.infoAreaId])
        retOutProcessInfoArea[value.infoAreaId] = new Map<string, ProcessInfoModel>();
      retOutProcessInfoArea[value.infoAreaId].set(key, value);
    }
    if (retOutProcessInRun) {
      this.process.inRunAll = retOutProcessInRun;
      this.process.inRunArea = retOutprocessInRunArea;
      this.process.infoArea = retOutProcessInfoArea;
      this.processSubject.next(this.process);
    } else {
      setTimeout(() => {
        this.process.inRunAll = retOutProcessInRun;
        this.process.inRunArea = retOutprocessInRunArea;
        this.process.infoArea = retOutProcessInfoArea;
        this.processSubject.next(this.process);
      }, 1000);
    }
    /** processInRun */
    this.cmsApiStore.setState({ type: SET_IN_PROCESSING_LIST, payload: this.process.infoAll });
  }
  /*
  /process info
  /
  */
}
