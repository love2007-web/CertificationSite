import { Component, OnInit } from '@angular/core';
import { SignupService } from '../../Services/signup.service';
import { MessageService, MenuItem } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-organization-signup',
  templateUrl: './organization-signup.component.html',
  styleUrl: './organization-signup.component.css',
})
export class OrganizationSignupComponent implements OnInit {
  items: MenuItem[] = [];
  public Name = '';
  public Website = '';
  public Email = '';
  public Password = '';
  public ConfirmPassword = '';
  public Country = '';
  public countries: any[] = [];
  public isLoading = false;
  constructor(private signUp: SignupService, private messageService: MessageService, private primengConfig: PrimeNGConfig) 
{}
  show() {
    this.primengConfig.ripple = true;
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
  }


 public buttonDisabled = false;

  submitFrom() {
    this.isLoading = true;
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
      (response: any) => {
        this.isLoading = false;
        console.log(response.message);
        this.messageService.add({ severity: 'success', summary: 'Sign Up Successful', detail: response.message });
        setTimeout(() => {
          window.location.href = '/organization_login';
        }, 2000);
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
        this.messageService.add({ severity: 'error', summary: 'Sign Up Failed', detail: error.error.message});
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
