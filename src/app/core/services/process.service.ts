
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
      this.processInfo = storeSnapshot.processInfoStore;

  }
  processInRun = false;
  public onInitAppComponent(): void {
    this.cmsStoreService.getState().subscribe((value) => {
      if (value.processInfoStore) {
        console.log("value.processInfoStore", value.processInfoStore.size);
        this.processInfo = value.processInfoStore;
        const retOut = [];
        for (const [key, value] of this.processInfo) {
          if (value && value.inRun === true) {
            retOut.push(key);
          }
        }
        /** processInRun */
        if (retOut && retOut.length > 0) {
          this.processInRun = true;
        }
        else {
          this.processInRun = false;
        }
      }
      else {
        this.processInRun = false;
      }
      // if (this.cdr) {
      //   this.cdr.detectChanges();
      // }
    });
  }

  /*
  /process info
  /
  */
  public processInfo = new Map<string, ProcessInfoModel>();
  public processStart(key: string, title: string = ' '): void {
    let model = new ProcessInfoModel();
    this.processInRun = true;
    model.inRun = true;
    model.title = title;
    this.processInfo.set(key, model);
    this.cmsStoreService.setState({ processInfoStore: this.processInfo });
  }
  public processStop(key: string, isSuccess = true): void {
    let model = this.processInfo.get(key);
    if (!model) {
      model = new ProcessInfoModel();
    }
    model.inRun = false;
    model.isSuccess = isSuccess;
    this.processInfo.set(key, model);

    const retOut = [];
    for (const [key, value] of this.processInfo) {
      if (value && value.inRun === true) {
        retOut.push(key);
      }
    }
    if (retOut && retOut.length > 0) {
      this.processInRun = true;
      this.cmsStoreService.setState({ processInfoStore: this.processInfo });
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
