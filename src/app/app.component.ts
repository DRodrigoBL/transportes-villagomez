import { Component } from '@angular/core';
import { OAuthGoogleService } from './auth/services/google.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'transportes-villagomez';

  constructor(public auth: OAuthGoogleService) {

  }

}
