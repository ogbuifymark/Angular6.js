import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SigninComponent } from './signin/signin.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  // {
  //   path: '', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthGuard]
  // },
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'users',
    component: UsersComponent, canActivate: [AuthGuard]
  },
  {
    path: 'login', component: SigninComponent
  },
];

@NgModule({
  imports: [
    BrowserModule, BrowserAnimationsModule,
    // MatButtonModule, MatCardModule, MatInputModule, MatSnackBarModule, MatToolbarModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
