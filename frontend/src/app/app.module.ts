import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './pages/public/navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './pages/public/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomePageComponent } from './pages/public/home-page/home-page.component';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { StyleClassModule } from 'primeng/styleclass';
import { ImageModule } from 'primeng/image';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { SponsorPageComponent } from './pages/public/sponsor-page/sponsor-page.component';
import { DialogModule } from 'primeng/dialog';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogService } from 'primeng/dynamicdialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AboutUsComponent } from './pages/public/about-us/about-us.component';
import { TeamPresentationComponent } from './pages/public/team-presentation/team-presentation.component';
import { NotFoundComponent } from './pages/public/not-found/not-found.component';
import { TournamentComponent } from './pages/public/tournament/tournament.component';
import { ShopComponent } from './pages/public/shop/shop.component';
import { ContactPageComponent } from './pages/public/contact-page/contact-page.component';
import { RequestService } from './_services/request.service';
import { ApiService } from './_services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConnectionComponent } from './pages/public/connection/connection.component';
import { RegisterComponent } from './pages/public/register/register.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './_interceptor/auth.interceptor';
import { PrivateComponent } from './pages/private/private.component';
import { MyspaceComponent } from './pages/private/myspace/myspace.component';
import { DataViewModule } from 'primeng/dataview';
import { FieldsetModule } from 'primeng/fieldset';
import { ChipModule } from 'primeng/chip';
import { PanelModule } from 'primeng/panel';
import { TeamsComponent } from './pages/private/teams/teams.component';
import { DialogTeamsComponent } from './pages/private/dialog/dialog-teams/dialog-teams.component';
import { MyteamComponent } from './pages/private/myteam/myteam.component';
import { SettingsComponent } from './pages/private/myteam/settings/settings.component';
import { PlayersComponent } from './pages/private/myteam/players/players.component';
import { TrainingsComponent } from './pages/private/myteam/trainings/trainings.component';
import { DialogPlayerComponent } from './pages/private/dialog/dialog-player/dialog-player.component';
import { DialogNewPlayerComponent } from './pages/private/dialog/dialog-new-player/dialog-new-player.component';
import { StaffComponent } from './pages/private/staff/staff.component';
import { RequestsComponent } from './pages/private/requests/requests.component';
import { DialogNewStaffComponent } from './pages/private/dialog/dialog-new-staff/dialog-new-staff.component';
import { DialogDeleteStaffComponent } from './pages/private/dialog/dialog-delete-staff/dialog-delete-staff.component';
import { SponsorsComponent } from './pages/private/sponsors/sponsors.component';
import { DialogMembershipRequestsComponent } from './pages/private/dialog/dialog-membership-requests/dialog-membership-requests.component';
import { DialogRequestComponent } from './pages/private/dialog/dialog-request/dialog-request.component';
import { DialogDeleteSponsorComponent } from './pages/private/dialog/dialog-delete-sponsor/dialog-delete-sponsor.component';
import { DialogUpdateSponsorComponent } from './pages/private/dialog/dialog-update-sponsor/dialog-update-sponsor.component';
import { DialogAddSponsorComponent } from './pages/private/dialog/dialog-add-sponsor/dialog-add-sponsor.component';
import { UsersComponent } from './pages/private/users/users.component';
import { TournamentsComponent } from './pages/private/tournaments/tournaments.component';
import { MessagingComponent } from './pages/private/myteam/messaging/messaging.component';
import { DialogDeleteRequestComponent } from './pages/private/dialog/dialog-delete-request/dialog-delete-request.component';
import { DialogNewTrainingComponent } from './pages/private/dialog/dialog-new-training/dialog-new-training.component';
import { DialogTrainingComponent } from './pages/private/dialog/dialog-training/dialog-training.component';
import { DialogUserComponent } from './pages/private/dialog/dialog-user/dialog-user.component';

const config: SocketIoConfig = { url: 'http://localhost:5555', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomePageComponent,
    SponsorPageComponent,
    AboutUsComponent,
    TeamPresentationComponent,
    NotFoundComponent,
    TournamentComponent,
    ShopComponent,
    ContactPageComponent,
    ConnectionComponent,
    RegisterComponent,
    PrivateComponent,
    MyspaceComponent,
    TeamsComponent,
    DialogTeamsComponent,
    MyteamComponent,
    SettingsComponent,
    PlayersComponent,
    TrainingsComponent,
    DialogPlayerComponent,
    DialogNewPlayerComponent,
    StaffComponent,
    RequestsComponent,
    DialogNewStaffComponent,
    DialogDeleteStaffComponent,
    SponsorsComponent,
    DialogMembershipRequestsComponent,
    DialogRequestComponent,
    DialogDeleteSponsorComponent,
    DialogUpdateSponsorComponent,
    DialogAddSponsorComponent,
    UsersComponent,
    TournamentsComponent,
    MessagingComponent,
    DialogDeleteRequestComponent,
    DialogNewTrainingComponent,
    DialogTrainingComponent,
    DialogUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    CarouselModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    CheckboxModule,
    FileUploadModule,
    TabMenuModule,
    PanelModule,
    TabViewModule,
    FieldsetModule,
    DataViewModule,
    SkeletonModule,
    ChipModule,
    CalendarModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    SocketIoModule.forRoot(config),
    CardModule,
    StyleClassModule,
    ImageModule,
    ToastModule,
    DialogModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    RequestService,
    ApiService,
    DialogService,
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
 
}