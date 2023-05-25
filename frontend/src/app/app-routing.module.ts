import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/public/home-page/home-page.component';
import { AboutUsComponent } from './pages/public/about-us/about-us.component';
import { SponsorPageComponent } from './pages/public/sponsor-page/sponsor-page.component';
import { TeamPresentationComponent } from './pages/public/team-presentation/team-presentation.component';
import { NotFoundComponent } from './pages/public/not-found/not-found.component';
import { TournamentComponent } from './pages/public/tournament/tournament.component';
import { ShopComponent } from './pages/public/shop/shop.component';
import { ContactPageComponent } from './pages/public/contact-page/contact-page.component';
import { ConnectionComponent } from './pages/public/connection/connection.component';
import { RegisterComponent } from './pages/public/register/register.component';

const routes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "about-us", component: AboutUsComponent },
  { path: "sponsors", component: SponsorPageComponent },
  { path: "team-presentation", component: TeamPresentationComponent },
  { path: "shop", component: ShopComponent },
  { path: "tournament", component: TournamentComponent },
  { path: "contact", component: ContactPageComponent },
  { path: "connection", component: ConnectionComponent },
  { path: "register", component: RegisterComponent },
  { path: "**", pathMatch: 'full', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
