import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { Observable, Subject } from 'rxjs';

import { UIService } from '../../shared/ui.service';
import { User } from '../model/user.model';

import * as fromRoot from '../../app.reducer';
import * as UI from '../../shared/ui.actions';

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
    private afs: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromRoot.State>
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
    this.store.dispatch(new UI.StartLoading());
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    console.log('credential to login: ' + JSON.stringify(credential.user));

    if (this.permittedUsers.length === 0) {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar('No hay usuarios registrados', 'Ok', 10000);
      throw new Error('Unable to login user, try again later. [this.permittedUsers.length === 0]');
    }

    for (const permittedUser of this.permittedUsers) {
      if (permittedUser.email === credential.user.email) {
        this.loggedInUser = permittedUser;
        console.log(
          'User logged in successfully ' + JSON.stringify(this.loggedInUser)
        );
        this.isAuthenticated = true;
        this.store.dispatch(new UI.StopLoading());
        return;
      }
    }
    this.uiService.showSnackbar('Permisos insuficientes', 'Ok', 10000);
    this.signOut();
    throw new Error('User not allowed to login [user not in firebase collection]');
  }

  async signOut() {
    await this.afAuth.auth
      .signOut()
      .then(() => {
        console.log('logged out successfully');
        this.store.dispatch(new UI.StopLoading());
        this.isAuthenticated = false;
      })
      .catch(() => console.log('failed to logout'));
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
