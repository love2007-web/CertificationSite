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
  constructor(private signUp: SignupService, private messageService: MessageService) {}

  submitFrom() {
    let data = {
      Email: this.Email,
      Password: this.Password,
    };
    console.log(data);

    this.signUp.organizationLogin(data).subscribe(
      (response: any) => {
        console.log(response);
        this.messageService.add({ severity: 'success', summary: 'Login Successful', detail: response.message });
      },
      (error) => {
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
