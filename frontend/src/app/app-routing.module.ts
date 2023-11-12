import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/public/home-page/home-page.component';
import { AboutUsComponent } from './pages/public/about-us/about-us.component';
import { SponsorPageComponent } from './pages/public/sponsor-page/sponsor-page.component';
import { TeamPresentationComponent } from './pages/public/team-presentation/team-presentation.component';
import { NotFoundComponent } from './pages/public/not-found/not-found.component';
import { TournamentComponent } from './pages/public/tournament/tournament.component';
import { ContactPageComponent } from './pages/public/contact-page/contact-page.component';
import { ConnectionComponent } from './pages/public/connection/connection.component';
import { RegisterComponent } from './pages/public/register/register.component';
import { PrivateComponent } from './pages/private/private.component';
import { MyspaceComponent } from './pages/private/myspace/myspace.component';
import { TeamsComponent } from './pages/private/teams/teams.component';
import { MyteamComponent } from './pages/private/myteam/myteam.component';
import { SettingsComponent } from './pages/private/myteam/settings/settings.component';
import { PlayersComponent } from './pages/private/myteam/players/players.component';
import { TrainingsComponent } from './pages/private/myteam/trainings/trainings.component';
import { StaffComponent } from './pages/private/staff/staff.component';
import { RequestsComponent } from './pages/private/requests/requests.component';
import { SponsorsComponent } from './pages/private/sponsors/sponsors.component';
import { UsersComponent } from './pages/private/users/users.component';
import { TournamentsComponent } from './pages/private/tournaments/tournaments.component';
import { MessagingComponent } from './pages/private/myteam/messaging/messaging.component';
import { ShopComponent } from './pages/private/shop/shop.component';
import { CartComponent } from './pages/private/cart/cart.component';
import { OrdersComponent } from './pages/private/orders/orders.component';
// import { SSOGuard } from './_guards/sso.guard';

const routes: Routes = [
  { 
    path: "", 
    component: HomePageComponent 
  },
  { 
    path: "about-us", 
    component: AboutUsComponent 
  },
  { 
    path: "sponsors", 
    component: SponsorPageComponent 
  },
  { 
    path: "team-presentation", 
    component: TeamPresentationComponent 
  },
  { 
    path: "tournament", 
    component: TournamentComponent 
  },
  { 
    path: "contact", 
    component: ContactPageComponent 
  },
  { 
    path: "connection", 
    component: ConnectionComponent 
  },
  { 
    path: "register", 
    component: RegisterComponent 
  },
  { 
    path: "private", 
    component: PrivateComponent,
    children: [
      {
        path: 'myspace',
        component: MyspaceComponent,
      },
      {
        path: 'teams',
        component: TeamsComponent,
      },
      {
        path: 'staff',
        component: StaffComponent,
      },
      {
        path: 'requests',
        component: RequestsComponent,
      },
      {
        path: 'sponsors',
        component: SponsorsComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'tournaments',
        component: TournamentsComponent,
      },
      {
        path: 'shop',
        component: ShopComponent,
      },
      {
        path: 'mycart/:cartId',
        component: CartComponent,
      },
      {
        path: 'mycart/:cartId/order',
        component: OrdersComponent,
      }
    ] 
  },
  {
    path: "myteam/:teamId",
    component: MyteamComponent,
    children: [
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'players',
        component: PlayersComponent,
      },
      {
        path: 'trainings',
        component: TrainingsComponent,
      },
      {
        path: 'messaging',
        component: MessagingComponent,
      }
    ]
  },
  { 
    path: "**", 
    pathMatch: 'full', 
    component: NotFoundComponent 
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
