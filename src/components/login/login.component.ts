import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../../providers/providers';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth, public auth: AuthService, private router: Router) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.router.navigate([`dashboard/${user.uid}`]).then(
          res => console.log(res),
          err => console.log(err)
        );
      } else {
        this.router.navigate(['']);
      }
    });
  }



  title = 'Checkers';
  user = { email: '', password: '' };


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

  ngOnInit() {
  }


}
