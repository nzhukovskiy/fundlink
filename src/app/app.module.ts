import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppHttpService } from './services/app-http.service';
import { AllStartupsComponent } from './components/startups/all-startups/all-startups.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/common/header/header.component';
import { SingleStartupComponent } from './components/startups/single-startup/single-startup.component';
import { AllInvestorsComponent } from './components/investors/all-investors/all-investors.component';
import { InvestorPageComponent } from './components/investors/investor-page/investor-page.component';
import { StartupPageComponent } from './components/startups/startup-page/startup-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatPaginatorModule} from "@angular/material/paginator";
import { LoginComponent } from './components/auth/login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import { RegisterComponent } from './components/auth/register/register.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    AllStartupsComponent,
    HeaderComponent,
    SingleStartupComponent,
    AllInvestorsComponent,
    InvestorPageComponent,
    StartupPageComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    NgbModule
  ],
  providers: [AppHttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
