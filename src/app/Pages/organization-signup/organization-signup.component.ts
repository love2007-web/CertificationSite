import { Component } from '@angular/core';
import { SignupService } from '../../Services/signup.service';


@Component({
  selector: 'app-organization-signup',
  templateUrl: './organization-signup.component.html',
  styleUrl: './organization-signup.component.css'
})
export class OrganizationSignupComponent {
  public FirstName = '';
  public LastName = '';
  public Email = '';
  public Password = '';
  public ConfirmPassword = '';
  constructor(private signUp: SignupService) {}

  submitFrom() {
    let data = {
      FirstName: this.FirstName,
      LastName: this.LastName,
      Email: this.Email,
      Password: this.Password,
      ConfirmPassword: this.ConfirmPassword,
    };
    console.log(data);

    this.signUp.postData(data).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
