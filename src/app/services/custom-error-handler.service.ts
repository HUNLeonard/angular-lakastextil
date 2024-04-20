import { ErrorHandler, Injectable } from '@angular/core';
import { SignComponent } from '../pages/sign/sign.component';
import { AccountComponent } from '../pages/account/account.component';

@Injectable()
export class CustomErrorHandlerService extends ErrorHandler {
  private signComponent: SignComponent;
  private accountComponent: AccountComponent;

  constructor(
    signComponent: SignComponent,
    accountComponent: AccountComponent
  ) {
    super();
    this.signComponent = signComponent;
    this.accountComponent= accountComponent;
  }

  override handleError(error: any): void {
    if (error && error.message && error.message.includes('FirebaseError')) {
        //console.log('An error occurred:', error);
        this.signComponent.handleError(error);
        this.accountComponent.handleError(error);
    } else {
      console.error('An error occurred:', error);
    }
  }
}