import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { CmsFileUploaderComponent } from './cms-file-uploader.component';


@NgModule({ declarations: [
        CmsFileUploaderComponent,
    ],
    exports: [
        CmsFileUploaderComponent
    ], imports: [CommonModule,
        FilePickerModule], providers: [
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class CmsFileUploaderModule {

}
