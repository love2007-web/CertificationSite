import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { SignupComponent } from './Pages/signup/signup.component';
import { UserSignupComponent } from './Pages/user-signup/user-signup.component';
import { OrganizationSignupComponent } from './Pages/organization-signup/organization-signup.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'user_signup', component: UserSignupComponent },
  { path: 'organization_signup', component: OrganizationSignupComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
