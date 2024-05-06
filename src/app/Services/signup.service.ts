import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  public baseURL = "https://certification-project-backend-2.onrender.com/";

  constructor(private http: HttpClient) {  }

  postData(data: any){
    return this.http.post(this.baseURL + "Api/user/sign-up", data);
  }

  oganizationSignUp(data: any){
    return this.http.post(this.baseURL + "Api/user/companysignUp", data);
  }


  getCountries(): Observable<any> {
    return this.http.get('https://restcountries.com/v3.1/all');
  }
  
  organizationLogin(data: any){
    return this.http.post(this.baseURL + "Api/user/companylogin", data);
  }
}
