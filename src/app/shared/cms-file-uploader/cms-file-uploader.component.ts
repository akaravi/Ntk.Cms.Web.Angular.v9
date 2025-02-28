import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FileUploaderPickerAdapter } from './fileUploaderPickerAdapter';
import { FilePreviewModel } from 'ngx-ntk-file-picker';

@Component({
    selector: 'app-cms-file-uploader',
    templateUrl: './cms-file-uploader.component.html',
    styleUrls: ['./cms-file-uploader.component.scss'],
    standalone: false
})
export class CmsFileUploaderComponent implements OnInit {
  static nextId = 0;
  id = ++CmsFileUploaderComponent.nextId;
  constructor(public http: HttpClient) {
    this.adapter = new FileUploaderPickerAdapter(this.http);
  }
  adapter: FileUploaderPickerAdapter;
  fileType: string | string[];
  @Output() optionUploadSuccess = new EventEmitter<FilePreviewModel>();
  @Input() set optionFileType(x: string | string[]) {
    if (x && x.length > 0) {
      this.fileType = x;
    }
  }
  ngOnInit(): void {

  }
  uploadSuccess(event: FilePreviewModel): void {
    this.optionUploadSuccess.emit(event);
  }
}
