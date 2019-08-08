import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OAuthGoogleService } from '../services/google.service';
import { UIService } from '../../shared/ui.service';
import * as fromRoot from '../../app.reducer';
import { User } from '../model/user.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  permittedUsers: User[];
  isLoading$: Observable<boolean>;

  constructor(
    private authService: OAuthGoogleService,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
  }

  login() {
    this.authService.googleSignin();
  }

  logout() {
    this.authService.signOut();
  }
}
