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
import { SponsorPageComponent } from './pages/public/sponsor-page/sponsor-page.component';
import { DialogModule } from 'primeng/dialog';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConnectionComponent } from './pages/public/connection/connection.component';
import { RegisterComponent } from './pages/public/register/register.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './_interceptor/auth.interceptor';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    CarouselModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
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
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }