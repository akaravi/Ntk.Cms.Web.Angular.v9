
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { CmsStoreService } from '../reducers/cmsStore.service';
import { ProcessInfoModel } from '../models/ProcessInfoModel';
import { Observable, Subscription } from 'rxjs';
import { TokenInfoModel } from 'ntk-cms-api';

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
  public onInitAppComponent(): void {
    this.cmsStoreService.getState().subscribe((value) => {
      if (value.processInfoStore) {
        /** processInRun */
        this.processInfoAll = value.processInfoStore;
        var retOutProcessInRun = false;
        var retOutprocessInRunArea: boolean[] = [];
        var retOutProcessInfoArea: Map<string, ProcessInfoModel>[] = []
        for (const [key, value] of this.processInfoAll) {
          //if (value && value.isComplate === false)
          {
            retOutProcessInRun = true;
            if(!retOutProcessInfoArea[value.infoAreaId])
              retOutProcessInfoArea[value.infoAreaId]=new Map<string, ProcessInfoModel>();
            retOutProcessInfoArea[value.infoAreaId].set(key, value);
            retOutprocessInRunArea[value.infoAreaId] = true;
          }
        }
        //console.log(retOutProcessInfoArea);
        //console.log(retOutprocessInRunArea);
        this.processInfoArea = retOutProcessInfoArea;
        this.processInRunArea = retOutprocessInRunArea;
        this.processInRun = retOutProcessInRun;
        /** processInRun */
      }
      else {
        this.processInRun = false;
      }
      if (this.cdr) {
        this.cdr.detectChanges();
      }
    });
  }
  /*
  /process info
  /
  */
  public processInfoArea: Map<string, ProcessInfoModel>[] = [];
  public processInfoAll = new Map<string, ProcessInfoModel>();
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
      this.processInRun = false;
      this.cmsStoreService.setState({ processInfoStore: new Map<string, ProcessInfoModel>() });
    }
  }
  /*
  /process info
  /
  */
}
