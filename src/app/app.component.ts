import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AuthService } from '../providers/providers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public afAuth: AngularFireAuth, public auth: AuthService) {
    this.afAuth.authState.subscribe((user) => {
      console.log(user);
    });
  }



  title = 'Checkers';
  user =  {email: '', password: ''};


  login() {
    this.auth.login(this.user).then(
      (res) => {
        console.log(res);
      },
      err => console.log(err)
    );
  }

  register() {
    this.auth.register(this.user).then(
      (res) => {
        console.log(res);
      },
      err => console.log(err)
    );
  }
}
