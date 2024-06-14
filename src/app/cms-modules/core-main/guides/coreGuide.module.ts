import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';

import {
  CoreGuideService, CoreModuleService
} from 'ntk-cms-api';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreInfoComponent } from '../site/info/core-info.component';
import { CoreGuideAddComponent } from './add/add.component';
import { CoreGuideComponent } from './coreGuide.component';
import { CoreGuideRouting } from './coreGuide.routing';
import { CoreGuideEditComponent } from './edit/edit.component';
import { CoreGuideListComponent } from './list/list.component';
import { CoreGuideSelectorComponent } from './selector/selector.component';
import { CoreGuideTreeComponent } from './tree/tree.component';


@NgModule({
  declarations: [
    CoreGuideComponent,
    CoreGuideListComponent,
    CoreGuideAddComponent,
    CoreGuideEditComponent,
    CoreGuideSelectorComponent,
    CoreGuideTreeComponent,
    CoreInfoComponent,
  ],
  exports: [
    CoreGuideComponent,
    CoreGuideListComponent,
    CoreGuideAddComponent,
    CoreGuideEditComponent,
    CoreGuideSelectorComponent,
    CoreGuideTreeComponent,
    CoreInfoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreGuideRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule,
    AngularEditorModule,
    DragDropModule,
    CmsFileManagerModule,
  ],
  providers: [
    CoreGuideService,
    CoreModuleService,
  ]
})
export class CoreGuideCmsModule {
}
