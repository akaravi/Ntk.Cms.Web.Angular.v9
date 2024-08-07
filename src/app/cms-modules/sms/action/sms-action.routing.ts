import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SmsActionSendMessageComponent } from './send-message/send-message.component';
import { SmsActionComponent } from './sms-action.component';
import { SmsActionSendMessageApiComponent } from './send-message-api/send-message-api.component';

const routes: Routes = [
  {
    path: '',
    component: SmsActionComponent,
    children: [
      {
        path: 'send-message',
        component: SmsActionSendMessageComponent
      },
      {
        path: 'send-message/inbox-extras',
        component: SmsActionSendMessageComponent
      },
      {
        path: 'send-message/outbox-extras',
        component: SmsActionSendMessageComponent
      },
      {
        path: 'send-api',
        component: SmsActionSendMessageApiComponent
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsActionRoutes {
}
