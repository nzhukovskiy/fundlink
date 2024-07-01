import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllInvestorsComponent } from './components/investors/all-investors/all-investors.component';
import { AppComponent } from './app.component';
import { AllStartupsComponent } from './components/startups/all-startups/all-startups.component';
import { InvestorPageComponent } from './components/investors/investor-page/investor-page.component';
import { StartupPageComponent } from './components/startups/startup-page/startup-page.component';
import {LoginComponent} from "./components/auth/login/login.component";
import {RegisterComponent} from "./components/auth/register/register.component";

const routes: Routes = [
    {path: '', component: AllStartupsComponent},
    {path: 'investors', component: AllInvestorsComponent},
    {path: 'investors/:id', component: InvestorPageComponent},
    {path: 'startups', component: AllStartupsComponent},
    {path: 'startups/:id', component: StartupPageComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
