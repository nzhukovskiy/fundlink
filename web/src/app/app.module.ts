import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppHttpService } from './services/app-http.service';
import { AllStartupsComponent } from './components/startups/all-startups/all-startups.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/common/header/header.component';
import { SingleStartupComponent } from './components/startups/single-startup/single-startup.component';
import { AllInvestorsComponent } from './components/investors/all-investors/all-investors.component';
import { InvestorPageComponent } from './components/investors/investor-page/investor-page.component';
import { StartupPageComponent } from './components/startups/startup-page/startup-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { LoginComponent } from './components/auth/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/auth/register/register.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './components/profile/profile/profile.component';
import { StartupProfileComponent } from './components/profile/startup-profile/startup-profile.component';
import { InvestorProfileComponent } from './components/profile/investor-profile/investor-profile.component';
import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MatIconModule } from '@angular/material/icon';
import { EditFundingRoundComponent } from './components/funding-rounds/edit-funding-round/edit-funding-round.component';
import { NumericOnlyDirective } from './directives/numeric-only.directive';
import { SubmitDialogComponent } from './dialogs/submit-dialog/submit-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EditStartupComponent } from './components/startups/edit-startup/edit-startup.component';
import { CreateInvestmentComponent } from './components/dialogs/create-investment/create-investment.component';
import { PageNotFoundComponent } from './components/common/page-not-found/page-not-found.component';
import { MoneyConverterPipePipe } from './pipes/money-converter-pipe.pipe';
import { EditInvestorComponent } from './components/investors/edit-investor/edit-investor.component';
import {
    RecommendedStartupsComponent,
} from './components/startups/recommended-startups/recommended-startups.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ChatComponent } from './components/chat/chat/chat.component';
import { MessageComponent } from './components/chat/message/message.component';
import { GotoChatComponent } from './components/common/goto-chat/goto-chat.component';
import { SendMessageComponent } from './components/chat/send-message/send-message.component';
import { AllChatsComponent } from './components/chat/all-chats/all-chats.component';
import { NgChartsModule } from 'ng2-charts';
import { ClearableSelectComponent } from './components/common/clearable-select/clearable-select.component';
import {
    SingleFundingRoundComponent,
} from './components/funding-rounds/single-funding-round/single-funding-round.component';
import {
    FundingRoundsListComponent,
} from './components/funding-rounds/funding-rounds-list/funding-rounds-list.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TagsListComponent } from './components/startups/tags-list/tags-list.component';
import { InputHelpTooltipComponent } from './components/common/input-help-tooltip/input-help-tooltip.component';
import { ProgressBarComponent } from './components/common/progress-bar/progress-bar.component';
import { UserAvatarComponent } from './components/chat/user-avatar/user-avatar.component';
import { ChatSocketService } from './services/socket/chat-socket.service';
import { NotificationsSocketService } from './services/socket/notifications-socket.service';
import { NotificationsComponent } from './components/notifications/notifications/notifications.component';
import {
    MessageNotificationComponent,
} from './components/notifications/message-notification/message-notification.component';
import {
    InvestmentNotificationComponent,
} from './components/notifications/investment-notification/investment-notification.component';
import { InvestmentsTableComponent } from './components/profile/investments-table/investments-table.component';
import { NgbdSortableHeaderDirective } from './directives/ngbd-sortable-header.directive';
import { DecimalInterceptor } from './interceptors/decimal.interceptor';
import { FinancialStatsComponent } from './components/startups/financial-stats/financial-stats.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { DcfVisualizationComponent } from './components/startups/dcf-visualization/dcf-visualization.component';
import { KatexDirective } from './directives/katex.directive';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { TextDialogComponent } from './components/dialogs/text-dialog/text-dialog.component';
import { RussianPaginatorIntlService } from './services/paginator/russian-paginator-intl.service';
import {
    FundingRoundDeadlineNotificationComponent,
} from './components/notifications/funding-round-deadline-notification/funding-round-deadline-notification.component';
import {
    FundingRoundChangeProposalNotificationComponent,
} from './components/notifications/funding-round-change-proposal-notification/funding-round-change-proposal-notification.component';
import {
    FundingRoundEndedNotificationComponent,
} from './components/notifications/funding-round-ended-notification/funding-round-ended-notification.component';
import {
    MostPopularStartupsComponent,
} from './components/startups/most-popular-startups/most-popular-startups.component';
import { StartupsListComponent } from './components/startups/startups-list/startups-list.component';
import { MostFundedStartupsComponent } from './components/startups/most-funded-startups/most-funded-startups.component';
import { MainStatsComponent } from './components/main-page/main-stats/main-stats.component';
import { ExitStartupComponent } from './components/profile/exit-startup/exit-startup.component';
import { ExitNotificationComponent } from './components/notifications/exit-notification/exit-notification.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { ShortenNumberPipe } from './pipes/shorten-number.pipe';


const socketIoConfig: SocketIoConfig = { url: 'http://localhost:3001'};
registerLocaleData(localeRu, 'ru-RU');
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
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
        SubmitDialogComponent,
        NumericOnlyDirective,
        EditStartupComponent,
        CreateInvestmentComponent,
        PageNotFoundComponent,
        MoneyConverterPipePipe,
        EditInvestorComponent,
        RecommendedStartupsComponent,
        MainPageComponent,
        ChatComponent,
        MessageComponent,
        GotoChatComponent,
        SendMessageComponent,
        AllChatsComponent,
        ClearableSelectComponent,
        SingleFundingRoundComponent,
        FundingRoundsListComponent,
        TagsListComponent,
        InputHelpTooltipComponent,
        ProgressBarComponent,
        UserAvatarComponent,
        NotificationsComponent,
        MessageNotificationComponent,
        InvestmentNotificationComponent,
        InvestmentsTableComponent,
        FinancialStatsComponent,
        FooterComponent,
        DcfVisualizationComponent,
        KatexDirective,
        TextDialogComponent,
        FundingRoundDeadlineNotificationComponent,
        FundingRoundChangeProposalNotificationComponent,
        FundingRoundEndedNotificationComponent,
        MostPopularStartupsComponent,
        StartupsListComponent,
        MostFundedStartupsComponent,
        MainStatsComponent,
        ExitStartupComponent,
        ExitNotificationComponent,
        ShortenNumberPipe,
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
        MatDialogModule,
        SocketIoModule.forRoot(socketIoConfig),
        NgChartsModule,
        MatTooltipModule,
        NgbdSortableHeaderDirective,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            defaultLanguage: 'ru'
        }),
        MatMenuModule,
    ],
    providers: [
        AppHttpService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: DecimalInterceptor,
            multi: true,
        },
        { provide: MatPaginatorIntl, useClass: RussianPaginatorIntlService },
        ChatSocketService,
        NotificationsSocketService],
    bootstrap: [AppComponent],
})
export class AppModule {
}
