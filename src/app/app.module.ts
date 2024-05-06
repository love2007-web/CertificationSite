import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


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
import {MatInputModule} from '@angular/material/input';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';
import { OrganizationLoginComponent } from './Pages/organization-login/organization-login.component';


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
    OrganizationSignupComponent,
    OrganizationLoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    HttpClientModule,
    MatInputModule,
    MatFormFieldModule,
    ButtonModule,
    ToastModule,
    RippleModule,
    SplitButtonModule,
  ],
  providers: [
    provideAnimationsAsync(),
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
