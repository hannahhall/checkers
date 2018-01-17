import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { RouterModule, Routes } from '@angular/router';
import { AsyncLocalStorageModule } from 'angular-async-local-storage';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AuthService, DashboardService, GameService } from '../providers/providers';
import { DashboardComponent, GameComponent, LoginComponent } from '../components/components';

const appRoutes: Routes = [
  { path: 'dashboard/:uid', component: DashboardComponent },
  { path: 'game/:gid', component: GameComponent },
  { path: '', component: LoginComponent },
  { path: '**', component: LoginComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    GameComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    ),
    AsyncLocalStorageModule
  ],
  providers: [
    AuthService,
    DashboardService,
    GameService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
