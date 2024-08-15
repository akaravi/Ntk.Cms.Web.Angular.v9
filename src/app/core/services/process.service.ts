
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { NtkCmsApiStoreService, ProcessInfoModel, SET_IN_PROCESSING_LIST } from 'ntk-cms-api';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  constructor(
    private cmsApiStore: NtkCmsApiStoreService,
  ) {
    const storeSnapshot = this.cmsApiStore.getStateSnapshot();
    if (storeSnapshot.ntkCmsAPiState.processInfoStore)
      this.processInfoAll = storeSnapshot.ntkCmsAPiState.processInfoStore;

  }
  public cmsApiStoreSubscribe: Subscription;
  public cdr: ChangeDetectorRef;
  public processInRun = false;
  public processInRunArea: boolean[] = [];
  public processInfoArea: Map<string, ProcessInfoModel>[] = [];
  public processInfoAll = new Map<string, ProcessInfoModel>();

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
  getOnChange(): Observable<Map<string, ProcessInfoModel>> {
    return this.cmsApiStore.getState((state) => {
      return state.ntkCmsAPiState.processInfoStore;
    });
  }
  /*
  /process info
  /
  */

  public processStart(key: string, title: string = ' ', infoAreaId: string = 'global'): void {
    let model = new ProcessInfoModel();
    this.processInRun = true;
    model.isComplate = false;
    model.title = title;
    model.infoAreaId = infoAreaId;
    this.processInfoAll.set(key, model);
    console.log("#### processStart ####", key, model);
    debugger
    /** processInRun */
    var retOutProcessInRun = false;
    var retOutprocessInRunArea: boolean[] = [];
    var retOutProcessInfoArea: Map<string, ProcessInfoModel>[] = []
    for (const [key, value] of this.processInfoAll) {
      if (value && value.isComplate === false) {
        retOutProcessInRun = true;
        retOutprocessInRunArea[value.infoAreaId] = true;
      }
      if (!retOutProcessInfoArea[value.infoAreaId])
        retOutProcessInfoArea[value.infoAreaId] = new Map<string, ProcessInfoModel>();
      retOutProcessInfoArea[value.infoAreaId].set(key, value);
    }
    this.processInRun = retOutProcessInRun;
    this.processInRunArea = retOutprocessInRunArea;
    this.processInfoArea = retOutProcessInfoArea;
    /** processInRun */
    this.cmsApiStore.setState({ type: SET_IN_PROCESSING_LIST, payload: this.processInfoAll });
  }
  public processStop(key: string, isSuccess = true): void {
    let model = this.processInfoAll.get(key);
    if (!model) {
      model = new ProcessInfoModel();
    }
    model.isComplate = true;
    model.isSuccess = isSuccess;
    this.processInfoAll.set(key, model);
    console.log("#### processStop ####", key, model)
    var retOutProcessInRun = false;
    for (const [key, value] of this.processInfoAll) {
      if (value && value.isComplate === false) {
        retOutProcessInRun = true;
      }
    }
    /** processInRun */
    var retOutProcessInRun = false;
    var retOutprocessInRunArea: boolean[] = [];
    var retOutProcessInfoArea: Map<string, ProcessInfoModel>[] = []
    for (const [key, value] of this.processInfoAll) {
      if (value && value.isComplate === false) {
        retOutProcessInRun = true;
        retOutprocessInRunArea[value.infoAreaId] = true;
      }
      if (!retOutProcessInfoArea[value.infoAreaId])
        retOutProcessInfoArea[value.infoAreaId] = new Map<string, ProcessInfoModel>();
      retOutProcessInfoArea[value.infoAreaId].set(key, value);
    }
    if (retOutProcessInRun) {
      this.processInRun = retOutProcessInRun;
      this.processInRunArea = retOutprocessInRunArea;
      this.processInfoArea = retOutProcessInfoArea;
    } else {
      setTimeout(() => {
        this.processInRun = retOutProcessInRun;
        this.processInRunArea = retOutprocessInRunArea;
        this.processInfoArea = retOutProcessInfoArea;
      }, 1000);
    }
    /** processInRun */
    this.cmsApiStore.setState({ type: SET_IN_PROCESSING_LIST, payload: this.processInfoAll });

  }
  /*
  /process info
  /
  */
}
