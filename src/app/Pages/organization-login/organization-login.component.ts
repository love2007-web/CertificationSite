import { Component } from '@angular/core';
import { SignupService } from '../../Services/signup.service';
import { MessageService, MenuItem } from 'primeng/api';


@Component({
  selector: 'app-organization-login',
  templateUrl: './organization-login.component.html',
  styleUrl: './organization-login.component.css'
})
export class OrganizationLoginComponent {
  public FirstName = '';
  public LastName = '';
  public Email = '';
  public Password = '';
  public ConfirmPassword = '';
  public isLoading = false;
  constructor(private signUp: SignupService, private messageService: MessageService) {}

  submitFrom() {
    this.isLoading = true;
    let data = {
      Email: this.Email,
      Password: this.Password,
    };
    console.log(data);

    this.signUp.organizationLogin(data).subscribe(
      (response: any) => {
        this.isLoading = false;
        console.log(response);
        this.messageService.add({ severity: 'success', summary: 'Login Successful', detail: response.message });
        setTimeout(() => {
          window.location.href = '/organization_dashboard';
        }, 2000);
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
        this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: error.error.message});
      }
    );
  }
  showPassword: boolean = false;

  show() {
    this.showPassword = !this.showPassword;
  }
}
