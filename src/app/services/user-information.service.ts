// src/app/services/user-information.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserInformation, ShippingData } from 'src/app/models/user-information.model';

@Injectable({
  providedIn: 'root'
})
export class UserInformationService {
  constructor(
    private auth: AngularFireAuth, 
    private firestore: AngularFirestore
  ) {}

  async createUserWithEmailAndPassword(email: string, password: string): Promise<any> {
    const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
    const userId = userCredential?.user?.uid;

    if (userId) {
      const newUserInfo: UserInformation = {
        username: '', // You can set the initial username here
        email: email,
        shippingData: {
          name: '',
          phoneNumber: null,
          zipCode: null,
          city: '',
          address: '',
        }
      };

      await this.firestore.collection('userInformation').doc(userId).set(newUserInfo);
    }

    return;
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<any> {
    return await this.auth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        //console.error('Error signing in:', error);
        throw error;
      });
  }

  updateEmail(newEmail: string): Promise<void> {
    return this.auth.currentUser.then((user) => {
      if (user) {
        return user.updateEmail(newEmail).then(() => {
          // Update the email in Firestore
          const userInfoDoc: AngularFirestoreDocument<UserInformation> = this.firestore.doc(`userInformation/${user.uid}`);
          return userInfoDoc.update({ email: newEmail });
        });
      }
      return Promise.reject('No user found');
    });
  }

  updateUsername(userId: string, newUsername: string): Promise<void> {
    const userInfoDoc: AngularFirestoreDocument<UserInformation> = this.firestore.doc(`userInformation/${userId}`);
    return userInfoDoc.update({ username: newUsername });
  }

  updateUserEmail(userId: string, newEmail: string): Promise<void> {
    const userInfoDoc: AngularFirestoreDocument<UserInformation> = this.firestore.doc(`userInformation/${userId}`);
    return userInfoDoc.update({ email: newEmail });
  }

  updatePassword(newPassword: string): Promise<void> {
    return this.auth.currentUser.then((user) => {
      if (user) {
        return user.updatePassword(newPassword);
      }
      return Promise.reject('No user found');
    });
  }

  updateShippingData(userId: string, shippingData: ShippingData): Promise<void> {
    const userInfoDoc: AngularFirestoreDocument<UserInformation> = this.firestore.doc(`userInformation/${userId}`);
    return userInfoDoc.update({ shippingData });
  }

  getUserInformation(): Observable<UserInformation | null> {
    return this.auth.user.pipe(
      switchMap((user) => {
        if (user) {
          const userInfoDoc: AngularFirestoreDocument<UserInformation> = this.firestore.doc(`userInformation/${user.uid}`);
          return userInfoDoc.valueChanges().pipe(
            map((userInfo) => userInfo || null)
          );
        }
        return of(null);
      })
    );
  }

  saveUserInformation(userInformation: UserInformation): Promise<void> {
    return this.auth.user.pipe(
      switchMap((user) => {
        if (user) {
          const userInfoDoc: AngularFirestoreDocument<UserInformation> = this.firestore.doc(`userInformation/${user.uid}`);
          return userInfoDoc.set(userInformation);
        }
        return from([]);
      })
    ).toPromise();
  }
}