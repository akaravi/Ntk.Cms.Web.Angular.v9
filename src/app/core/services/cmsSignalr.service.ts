import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { ToastrService } from 'ngx-toastr';
import { CmsNotificationModel, ErrorExceptionResultBase } from 'ntk-cms-api';
import { environment } from 'src/environments/environment';
import { PublicHelper } from '../helpers/publicHelper';
import { HubConnectionState } from '@microsoft/signalr';

// import {Notification} from '../models/notification';
//karavi import { ProductService } from './product.service';
//https://medium.com/@aym003.hit/notifications-system-in-net-6-and-angular-with-signalr-
//https://github.com/aym003/NotificationHubPartOne

@Injectable({
  providedIn: 'root'
})
export class CmsSignalrService {
  constructor(private toastr: ToastrService,
    private publicHelper: PublicHelper
  ) {

  }
  private hubConnection!: signalR.HubConnection;
  public async initiateSignalrConnection(): Promise<void> {
    const userToken = localStorage.getItem('userToken');
    const deviceToken = localStorage.getItem('deviceToken');

    // var messageHeaders: signalR.MessageHeaders = {
    //   "deviceToken": deviceToken
    // };
    try {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(environment.cmsServerConfig.configHubServerPath + 'notify',
          {
            accessTokenFactory: () => userToken,
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
          }
        )
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Error)
        .build();

      this.hubConnection.onreconnected(() => {
        console.log('signalR Reconnected');
      });

      await this.hubConnection
        .start()
        .then(() => {
          if (environment.consoleLog)
            console.log('signalR Connection started');
          console.log(`SignalR connection success! connectionId: ${this.hubConnection.connectionId}`);
          //if (onActionConnected)
          // onActionConnected;
        })
        .catch(err => console.log('Error while signalR starting connection: ' + err));

    }
    catch (error) {
      console.log(`SignalR connection error: ${error}`);
    }

  }
  public login(token: string) {
    if (this.hubConnection && this.hubConnection.state == HubConnectionState.Connected)
      this.hubConnection.invoke("login", token)
  }
  public logout() {
    if (this.hubConnection && this.hubConnection.state == HubConnectionState.Connected)
      this.hubConnection.invoke("logout")
  }

  public addListenerMessage = (xFunc: any) => {
    if (this.hubConnection)
      this.hubConnection.on('ActionSendMessageToClient', (notification: CmsNotificationModel) => {
        if (notification.title?.length > 0) {
          notification.title = notification.title + " " + new Date().toLocaleTimeString();
          switch (notification.icon) {
            case 'info':
              this.toastr.info(notification.content.replace(/(?:\r\n|\r|\n)/g, '<br>'), notification.title, { positionClass: 'toast-top-center', timeOut: 0 });
              break;
            case 'warning':
              this.toastr.warning(notification.content.replace(/(?:\r\n|\r|\n)/g, '<br>'), notification.title, { positionClass: 'toast-top-center', timeOut: 0 });
              break;
            case 'success':
              this.toastr.success(notification.content.replace(/(?:\r\n|\r|\n)/g, '<br>'), notification.title, { positionClass: 'toast-top-center', timeOut: 0 });
              break;
            case 'show':
              this.toastr.show(notification.content.replace(/(?:\r\n|\r|\n)/g, '<br>'), notification.title, { positionClass: 'toast-top-center', timeOut: 0 });
              break;
            case 'error':
              this.toastr.error(notification.content.replace(/(?:\r\n|\r|\n)/g, '<br>'), notification.title, { positionClass: 'toast-top-center', timeOut: 0 });
              break;
            default:
              this.toastr.info(notification.content.replace(/(?:\r\n|\r|\n)/g, '<br>'), notification.title, { positionClass: 'toast-top-center', timeOut: 0 });
              break;
          }
        }
        // web-push generate-vapid-keys --json
        //{"publicKey":"BKxkwx4CTSU2psDIs5LDX08P7hEwsbgDZa2hjJqLjUj_gmjg0cOD1vSkqMtBfBZ52RvFXl1R55FIVrj5eUMbx1Q","privateKey":"El0I7GEeskNmXn5qrPppzz80_LCEF0zkcCt76_R_SEo"}
        if (notification.contentAction?.length > 0) {
          console.log(notification.contentAction);
          this.publicHelper.setProcessOrder({
            id: this.publicHelper.getGuid(),
            isComplate: false,
            isRun: false,
            isSuccess: false,
            contentAction: notification.contentAction,
            contentJson: notification.contentJson,
            contentClassName: notification.contentClassName,
          });

        }

        if (xFunc)
          xFunc;
      });
  }
  public addListenerActionLogin = () => {
    if (this.hubConnection)
      this.hubConnection.on('ActionLogin', (model: any) => {
        console.log('ActionLogin');
        console.log(model);
        this.toastr.warning("وارد شدید");
      });
  }
  public addListenerActionLogout = () => {
    if (this.hubConnection)
      this.hubConnection.on('ActionLogout', (model: ErrorExceptionResultBase) => {
        console.log('ActionLogout');
        console.log(model);
        this.toastr.warning("خارج شدید");
      });
  }
  public subscribeToProduct(productId: string) {
    if (this.hubConnection && this.hubConnection.state == HubConnectionState.Connected)
      this.hubConnection.invoke("SuscribeToProduct", productId)
  }
}
