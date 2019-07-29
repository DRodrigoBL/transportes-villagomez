import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OAuthGoogleService } from '../services/google.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {


  constructor(private authService: OAuthGoogleService) {

  }

  ngOnInit() {
  }

  login() {
    this.authService.googleSignin();
  }
}
