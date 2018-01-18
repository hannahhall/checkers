import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AuthService } from '../providers/providers';
import { Router } from '@angular/router';
import { AsyncLocalStorage } from 'angular-async-local-storage';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public afAuth: AngularFireAuth, private router: Router, protected localStorage: AsyncLocalStorage) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        const currentUser = { email: user.email, uid: user.uid };
        this.localStorage.setItem('currentUser', currentUser).subscribe();
        this.router.navigate([`dashboard`]);
      } else {
        this.localStorage.removeItem('currentUser').subscribe();
        this.router.navigate(['']);
      }
    });
  }
}
