import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';
import { OAuthGoogleService } from '../../auth/services/google.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth = false;
  authSubscription: Subscription;

  constructor(private authService: OAuthGoogleService) {}

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(
      authStatus => {
        this.isAuth = authStatus;
      }
    );
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.signOut();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
