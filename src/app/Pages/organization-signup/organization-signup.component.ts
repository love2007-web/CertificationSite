import { Component } from '@angular/core';
import { SignupService } from '../../Services/signup.service';


@Component({
  selector: 'app-organization-signup',
  templateUrl: './organization-signup.component.html',
  styleUrl: './organization-signup.component.css'
})
export class OrganizationSignupComponent {
  public Name = '';
  public Website = '';
  public Email = '';
  public Password = '';
  public ConfirmPassword = '';
  public Country = '';
  constructor(private signUp: SignupService) {}

  submitFrom() {
    let data = {
      FirstName: this.Name,
      Website: this.Website,
      Email: this.Email,
      Password: this.Password,
      ConfirmPassword: this.ConfirmPassword,
      Country: this.Country,
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
