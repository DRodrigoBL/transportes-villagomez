import { Component, OnInit } from '@angular/core';
import { OAuthGoogleService } from '../services/google.service';
import { User } from '../model/user.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  permittedUsers: User[];

  constructor(private authService: OAuthGoogleService) {

  }

  ngOnInit() {
  }

  login() {
    this.authService.googleSignin();
  }

  logout() {
    this.authService.signOut();
  }
}
