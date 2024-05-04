import { Component, OnInit } from '@angular/core';
import { SignupService } from '../../Services/signup.service';

@Component({
  selector: 'app-organization-signup',
  templateUrl: './organization-signup.component.html',
  styleUrl: './organization-signup.component.css',
})
export class OrganizationSignupComponent implements OnInit {
  public Name = '';
  public Website = '';
  public Email = '';
  public Password = '';
  public ConfirmPassword = '';
  public Country = '';
  public countries: any[] = [];
  constructor(private signUp: SignupService) {}

  submitFrom() {
    let data = {
      CompanyName: this.Name,
      Website: this.Website,
      Email: this.Email,
      Password: this.Password,
      ConfirmPassword: this.ConfirmPassword,
      Location: this.Country,
    };
    console.log(data);

    this.signUp.oganizationSignUp(data).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  ngOnInit(): void {
    this.signUp.getCountries().subscribe((data: any[]) => {
      data.sort((a: any, b: any) => a.name.common.localeCompare(b.name.common));

      data.forEach((item: any) => {
        this.countries.push(item.name.common);
      });        
    });
  }
}
