// account.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserInformation, ShippingData } from '../../models/user-information.model';
import { UserInformationService } from '../../services/user-information.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseError } from '@firebase/util';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {
  accountForm: FormGroup | any;
  shippingForm: FormGroup | any;
  userInformation: UserInformation | null = null;

  newShippingData: ShippingData = {
    name: '',
    phoneNumber: null,
    zipCode: null,
    city: '',
    address: ''
  };

  emailUpdateError: string = '';
  passwordUpdateError: string = '';
  shippingDataUpdateError: string = '';

  private userInfoSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private userInformationService: UserInformationService,
    private formBuilder: FormBuilder
  ) {}



  ngOnInit(): void {
    this.initAccountForm();
    this.initShippingForm();
    this.getUserInformation();
  }

  ngOnDestroy(): void {
    if (this.userInfoSubscription) {
      this.userInfoSubscription.unsubscribe();
    }
  }

  initAccountForm(): void {
    this.accountForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      username: ['', Validators.required]
    });
  }

  initShippingForm(): void {
    this.shippingForm = this.formBuilder.group({
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      zipCode: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  getUserInformation(): void {
    this.userInfoSubscription = this.userInformationService.getUserInformation().subscribe((userInfo) => {
      this.userInformation = userInfo;
      if (userInfo) {
        this.accountForm.patchValue({
          email: userInfo.email,
          username: userInfo.username,
        });
        this.shippingForm.patchValue({
          name: userInfo.shippingData.name,
          phoneNumber: userInfo.shippingData.phoneNumber,
          zipCode: userInfo.shippingData.zipCode,
          city: userInfo.shippingData.city,
          address: userInfo.shippingData.address
        });
      }
    });
  }

  async updateUsername(): Promise<void> {
    if (this.accountForm.controls['username'].valid) {
      this.authService.getCurrentUserId().subscribe(
        userId => {
          if (userId) {
            this.userInformationService.updateUsername(userId, this.accountForm.controls['username'].value)
              .then(() => {
                console.log('Username updated successfully.');
              })
              .catch((error) => {
                console.error('Error updating username:', error);
              });
          } else {
            console.error('No user ID available.');
          }
        },
        (error) => {
          console.error('Error getting user ID:', error);
        }
      );
    } else {
      console.error('Invalid username format.');
    }
  }


  updateEmail(): void {
    this.emailUpdateError = '';
    if (this.accountForm.controls['email'].valid) {
      this.userInformationService.updateEmail(this.accountForm.controls['email'].value)
        .then(() => {
          console.log('Email updated successfully.');
        })
        .catch((error: FirebaseError) => {
          this.handleError(error);
        });
    } else {
      this.emailUpdateError = 'Please enter a valid email address.';
    }
  }


  updatePassword(): void {
    this.passwordUpdateError = '';
    if (this.accountForm.controls['password'].valid) {
      this.userInformationService.updatePassword(this.accountForm.controls['password'].value)
        .then(() => {
          console.log('Password updated successfully.');
        })
        .catch((error: FirebaseError) => {
          this.handleError(error);
        });
    } else {
      this.passwordUpdateError = 'Password must be at least 6 characters long.';
    }
  }

  async updateShippingData(): Promise<void> {
    this.shippingDataUpdateError = '';
  
    if (this.userInformation) {
      try {
        const userId = await firstValueFrom(this.authService.getCurrentUserId());
        if (userId) {
          const updatedShippingData: ShippingData = {
            name: this.shippingForm.get('name')?.value,
            phoneNumber: this.shippingForm.get('phoneNumber')?.value,
            zipCode: this.shippingForm.get('zipCode')?.value,
            city: this.shippingForm.get('city')?.value,
            address: this.shippingForm.get('address')?.value
          };
  
          await this.userInformationService.updateShippingData(userId, updatedShippingData);
          console.log('Shipping data updated successfully.');
        }
      } catch (error) {
        this.shippingDataUpdateError = 'Error updating shipping data: ' + error;
        console.error('Error updating shipping data:', error);
      }
    }
    
  }

  handleError(error: FirebaseError): void {
    if (error.code === 'auth/email-already-in-use') {
      this.emailUpdateError = 'Email is already in use.';
    } else if (error.code === 'auth/wrong-password') {
      this.passwordUpdateError = 'Invalid password.';
    } else {
      this.emailUpdateError = error.message || 'An error occurred while updating the email.';
      this.passwordUpdateError = error.message || 'An error occurred while updating the password.';
    }
  }

}