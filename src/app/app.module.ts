import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppHttpService } from './services/app-http.service';
import { AllStartupsComponent } from './components/startups/all-startups/all-startups.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { HeaderComponent } from './components/common/header/header.component';
import { SingleStartupComponent } from './components/startups/single-startup/single-startup.component';
import { AllInvestorsComponent } from './components/investors/all-investors/all-investors.component';
import { InvestorPageComponent } from './components/investors/investor-page/investor-page.component';
import { StartupPageComponent } from './components/startups/startup-page/startup-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatPaginatorModule} from "@angular/material/paginator";
import { LoginComponent } from './components/auth/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RegisterComponent } from './components/auth/register/register.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './components/profile/profile/profile.component';
import { StartupProfileComponent } from './components/profile/startup-profile/startup-profile.component';
import { InvestorProfileComponent } from './components/profile/investor-profile/investor-profile.component';
import {ToastrModule} from "ngx-toastr";
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import {MatIconModule} from "@angular/material/icon";
import { EditFundingRoundComponent } from './components/funding-rounds/edit-funding-round/edit-funding-round.component';
import { CreateFundingRoundComponent } from './components/funding-rounds/create-funding-round/create-funding-round.component';
import { NumericOnlyDirective } from './directives/numeric-only.directive';
import {SubmitDialogComponent} from "./dialogs/submit-dialog/submit-dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import { EditStartupComponent } from './components/startups/edit-startup/edit-startup.component';
import { CreateInvestmentComponent } from './components/dialogs/create-investment/create-investment.component';
import { PageNotFoundComponent } from './components/common/page-not-found/page-not-found.component';
import { MoneyConverterPipePipe } from './pipes/money-converter-pipe.pipe';
import { EditInvestorComponent } from './components/investors/edit-investor/edit-investor.component';
import { RecommendedStartupsComponent } from './components/startups/recommended-startups/recommended-startups.component';
import { MainPageComponent } from './components/main-page/main-page.component';

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
    RegisterComponent,
    ProfileComponent,
    StartupProfileComponent,
    InvestorProfileComponent,
    EditFundingRoundComponent,
    CreateFundingRoundComponent,
    SubmitDialogComponent,
    NumericOnlyDirective,
    EditStartupComponent,
    CreateInvestmentComponent,
    PageNotFoundComponent,
    MoneyConverterPipePipe,
    EditInvestorComponent,
    RecommendedStartupsComponent,
    MainPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    NgbModule,
    ToastrModule.forRoot(),
    MatIconModule,
    FormsModule,
    MatDialogModule
  ],
  providers: [AppHttpService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
