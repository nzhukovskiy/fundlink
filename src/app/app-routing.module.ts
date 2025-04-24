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
import { MainPageComponent } from './components/main-page/main-page.component';
import {ChatComponent} from "./components/chat/chat/chat.component";
import {chatResolver} from "./resolvers/chat.resolver";
import {startupResolver} from "./resolvers/startup.resolver";
import {investorResolver} from "./resolvers/investor.resolver";
import { AllChatsComponent } from './components/chat/all-chats/all-chats.component';
import { fundingRoundResolver } from './resolvers/funding-round.resolver';
import { NotificationsComponent } from './components/notifications/notifications/notifications.component';

const routes: Routes = [
    {path: '', component: MainPageComponent},
    {path: 'investors', component: AllInvestorsComponent},
    {path: 'investors/edit', component: EditInvestorComponent, canActivate: [authGuard, rolesGuard(Roles.INVESTOR)]},
    {path: 'investors/:id', component: InvestorPageComponent, resolve: {data: investorResolver}},
    {path: 'startups', component: AllStartupsComponent},
    {path: 'startups/edit', component: EditStartupComponent, canActivate: [authGuard, rolesGuard(Roles.STARTUP)]},
    {path: 'startups/:id', component: StartupPageComponent, resolve: {startup: startupResolver}},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
    {path: 'fundingRounds/:id/edit', component: EditFundingRoundComponent, canActivate: [authGuard, rolesGuard(Roles.STARTUP)], resolve: {fundingRound: fundingRoundResolver}},
    {path: 'fundingRounds/create', component: EditFundingRoundComponent, canActivate: [authGuard, rolesGuard(Roles.STARTUP)]},
    {path: 'chats', component: AllChatsComponent, canActivate: [authGuard]},
    {path: 'chats/new', component: ChatComponent, canActivate: [authGuard]},
    {path: 'chats/:id', component: ChatComponent, canActivate: [authGuard], resolve: {chat: chatResolver}},
    {path: 'notifications', component: NotificationsComponent, canActivate: [authGuard]},
    {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
