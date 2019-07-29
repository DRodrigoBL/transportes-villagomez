import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { User } from '../model/user.model';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OAuthGoogleService {

  user$: Observable<User>;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  // initAuthListener() {
  //   this.afAuth.authState.subscribe(user => {
  //     if (user) {
  //       this.store.dispatch(new Auth.SetAuthenticated());
  //       this.router.navigate(['/training']);
  //     } else {
  //       this.trainingService.cancelSubscriptions();
  //       this.store.dispatch(new Auth.SetUnauthenticated());
  //       this.router.navigate(['/login']);
  //     }
  //   });
  // }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    console.log('credential to login: ' + JSON.stringify( credential.user));
  }

  async signOut() {
    await this.afAuth.auth.signOut();
  }
}
