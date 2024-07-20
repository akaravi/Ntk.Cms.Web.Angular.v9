
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ProcessInfoModel } from '../models/ProcessInfoModel';
import { CmsStoreService } from '../reducers/cmsStore.service';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  constructor(
    private cmsStoreService: CmsStoreService,
    //private cdr: ChangeDetectorRef
  ) {
    const storeSnapshot = this.cmsStoreService.getStateSnapshot();
    if (storeSnapshot.processInfoStore)
      this.processInfoAll = storeSnapshot.processInfoStore;

  }
  public cdr: ChangeDetectorRef;
  processInRun = false;
  processInRunArea: boolean[] = [];
  public processInfoArea: Map<string, ProcessInfoModel>[] = [];
  public processInfoAll = new Map<string, ProcessInfoModel>();
  public onInitAppComponent(): void {
    this.cmsStoreService.getState().subscribe((value) => {
      if (value.processInfoStore) {
        /** processInRun */
        this.processInfoAll = value.processInfoStore;
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
        //debugger
        //console.log(retOutProcessInfoArea);
        //console.log(retOutprocessInRunArea);
        this.processInRun = retOutProcessInRun;
        this.processInRunArea = retOutprocessInRunArea;
        this.processInfoArea = retOutProcessInfoArea;
        /** processInRun */
      }
      else {
        this.processInRun = false;
        this.processInRunArea = [];
        this.processInfoArea = [];
      }
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
    this.cmsStoreService.setState({ processInfoStore: this.processInfoAll });
  }
  public processStop(key: string, isSuccess = true): void {
    let model = this.processInfoAll.get(key);
    if (!model) {
      model = new ProcessInfoModel();
    }
    model.isComplate = true;
    model.isSuccess = isSuccess;
    this.processInfoAll.set(key, model);

    var retOutProcessInRun = false;
    for (const [key, value] of this.processInfoAll) {
      if (value && value.isComplate === false) {
        retOutProcessInRun = true;
      }
    }

    if (retOutProcessInRun) {
      this.processInRun = true;
      this.cmsStoreService.setState({ processInfoStore: this.processInfoAll });
    }
    else {
      setTimeout(() => {
        this.processInRun = false;
        this.processInRunArea = [];
        this.processInfoArea = [];
        this.processInfoAll = new Map<string, ProcessInfoModel>();
        this.cmsStoreService.setState({ processInfoStore: this.processInfoAll });
      }, 1000);
    }

  }
  /*
  /process info
  /
  */
}
