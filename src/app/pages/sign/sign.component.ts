// src/app/components/sign/sign.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseError } from '@firebase/util';
import { UserInformationService } from '../../services/user-information.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent {
  signForm: FormGroup;
  isSignUp: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userInformationService: UserInformationService
  ) {
    this.signForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;
    const { email, password } = this.signForm.value;
  
    try {
      if (this.isSignUp) {
        this.userInformationService.createUserWithEmailAndPassword(email, password)
          .then(() => {
            this.router.navigate(['/']);
          })
          .catch((error) => {
            this.handleError(error as FirebaseError);
          });
      } else {
        this.userInformationService.signInWithEmailAndPassword(email, password)
          .then(() => {
            this.router.navigate(['/']);
          })
          .catch((error) => {
            this.handleError(error as FirebaseError);
          });
      }
    
    } catch (error) {
      if (error instanceof FirebaseError) {
        this.handleError(error);
      } else {
        //console.error('Error:', error);
        this.errorMessage = 'An error occurred. Please try again.';
      }
      this.isLoading = false; 
    } finally {
      this.isLoading = false;
    }
  }

  toggleSignUpMode(event: Event) {
    event.preventDefault();
    this.isSignUp = !this.isSignUp;
    this.errorMessage = '';
  }

  handleError(error: FirebaseError) {
    // Check the error code and set the appropriate error message
    switch (error.code) {
      case 'auth/email-already-in-use':
        this.errorMessage = 'Email is already in use.';
        break;
      case 'auth/wrong-password':
        this.errorMessage = 'Invalid email or password.';
        break;
      case 'auth/user-not-found':
        this.errorMessage = error.message;
        break;
      default:
        this.errorMessage = error.message || 'An error occurred. Please try again.';
    }
  }
}