import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import { SummaryPipe } from './summary.pipe';
import {MatCardModule} from '@angular/material/card';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { HomeComponent } from './Pages/home/home.component';
import { HeroComponent } from './Components/hero/hero.component';
import { WhyComponent } from './Components/why/why.component';
import { SignupComponent } from './Pages/signup/signup.component';
import { UserSignupComponent } from './Pages/user-signup/user-signup.component';
import { HttpClientModule } from '@angular/common/http';
import { OrganizationSignupComponent } from './Pages/organization-signup/organization-signup.component';


@NgModule({
  declarations: [
    AppComponent,
    SummaryPipe,
    NavbarComponent,
    HomeComponent,
    HeroComponent,
    WhyComponent,
    SignupComponent,
    UserSignupComponent,
    OrganizationSignupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    HttpClientModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
