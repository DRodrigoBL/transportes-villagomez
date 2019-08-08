import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { User } from '../model/user.model';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { Observable, Subject } from 'rxjs';

@Injectable()
export class OAuthGoogleService {
  user$: Observable<User>;
  permittedUsers$: Observable<User[]>;

  permittedUsers: User[];
  loggedInUser: User;

  private permittedUsersCollection: AngularFirestoreCollection<User>;

  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.permittedUsersCollection = afs.collection<User>('users');
    this.permittedUsersCollection
      .valueChanges()
      .subscribe(users => (this.permittedUsers = users));
  }

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/cargas']);
      } else {
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    console.log('credential to login: ' + JSON.stringify(credential.user));

    if (this.permittedUsers.length === 0) {
      console.log('unable to login user, try again later');
      throw new Error('Unable to login user, try again later.');
    }

    for (const permittedUser of this.permittedUsers) {
      if (permittedUser.email === credential.user.email) {
        this.loggedInUser = permittedUser;
        console.log(
          'User logged in successfully ' + JSON.stringify(this.loggedInUser)
        );
        this.isAuthenticated = true;
        return;
      }
    }
    this.signOut();
    throw new Error('User not allowed to login');
  }

  async signOut() {
    await this.afAuth.auth
      .signOut()
      .then(() => {
        console.log('logged out successfully');
        this.isAuthenticated = false;
      })
      .catch(() => console.log('failed to logout'));
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
