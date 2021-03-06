import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UsersComponent } from './users/users.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { Http, HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { jqxDropDownListComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdropdownlist';
import { jqxChartComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxchart';
import { GraphComponent } from './graph/graph.component';
import { SigninComponent } from './signin/signin.component';
import { SocialLoginModule,  AuthServiceConfig,  GoogleLoginProvider,  FacebookLoginProvider} from 'angular-6-social-login';
import { LinkedinLoginProvider } from 'angular-6-social-login';
import { AuthGuard } from './auth.guard';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from './_service/Authentication.Service';



export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
      [
        // {
        //   id: FacebookLoginProvider.PROVIDER_ID,
        //   provider: new FacebookLoginProvider('Your-Facebook-app-id')
        // },
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('657825322723-6tlfvpomg132hl43p08s5sidi129ufub.apps.googleusercontent.com')
        },
          // {
          //   id: LinkedinLoginProvider.PROVIDER_ID,
          //   provider: new LinkedinLoginProvider('1098828800522-m2ig6bieilc3tpqvmlcpdvrpvn86q4ks.apps.googleusercontent.com')
          // },
      ]
  );
  return config;
}
@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    UsersComponent,
    DashboardComponent,
    // jqxBarGaugeComponent,
    jqxChartComponent,
    jqxDropDownListComponent,
    GraphComponent,
    SigninComponent,
  ],
  imports: [
    SocialLoginModule,
    // FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    BrowserAnimationsModule,
    // GuardComponent,
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
