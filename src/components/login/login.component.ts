import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../../providers/providers';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(public afAuth: AngularFireAuth, public auth: AuthService, private router: Router) { }

  title = 'Checkers';
  user = { email: '', password: '' };

  login() {
    this.auth.login(this.user);
  }

  register() {
    this.auth.register(this.user);
  }

}
