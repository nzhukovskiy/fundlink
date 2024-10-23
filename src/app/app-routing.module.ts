import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllInvestorsComponent} from './components/investors/all-investors/all-investors.component';
import {AllStartupsComponent} from './components/startups/all-startups/all-startups.component';
import {InvestorPageComponent} from './components/investors/investor-page/investor-page.component';
import {StartupPageComponent} from './components/startups/startup-page/startup-page.component';
import {LoginComponent} from "./components/auth/login/login.component";
import {RegisterComponent} from "./components/auth/register/register.component";
import {ProfileComponent} from "./components/profile/profile/profile.component";
import {authGuard} from "./guards/auth.guard";
import {EditFundingRoundComponent} from "./components/funding-rounds/edit-funding-round/edit-funding-round.component";
import {
  CreateFundingRoundComponent
} from "./components/funding-rounds/create-funding-round/create-funding-round.component";
import {EditStartupComponent} from "./components/startups/edit-startup/edit-startup.component";
import {rolesGuard} from "./guards/roles.guard";
import {Roles} from "./constants/roles";
import {PageNotFoundComponent} from "./components/common/page-not-found/page-not-found.component";
import { EditInvestorComponent } from './components/investors/edit-investor/edit-investor.component';

const routes: Routes = [
    {path: '', component: AllStartupsComponent},
    {path: 'investors', component: AllInvestorsComponent},
    {path: 'investors/:id', component: InvestorPageComponent},
    {path: 'investors/:id/edit', component: EditInvestorComponent, canActivate: [authGuard, rolesGuard(Roles.INVESTOR)]},
    {path: 'startups', component: AllStartupsComponent},
    {path: 'startups/:id', component: StartupPageComponent},
    {path: 'startups/:id/edit', component: EditStartupComponent, canActivate: [authGuard, rolesGuard(Roles.STARTUP)]},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
    {path: 'fundingRounds/:id/edit', component: EditFundingRoundComponent, canActivate: [authGuard, rolesGuard(Roles.STARTUP)]},
    {path: 'fundingRounds/create', component: CreateFundingRoundComponent, canActivate: [authGuard, rolesGuard(Roles.STARTUP)]},
    {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
