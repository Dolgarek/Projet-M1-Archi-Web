import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NotifierService} from "angular-notifier";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public headers: any;
  public options: any;

  constructor(private httpClient: HttpClient, private notifier: NotifierService, private router: Router) {
  }

  //login method, if res is ok then proceed to store data in local storage and notify user if not notify user with error message
  login(username: string, password: string) {
    try {
      this.httpClient.post('https://pedago.univ-avignon.fr:3223/login', {username: username, password: password}).subscribe(
        (res: any) => {
          //Set data and token. In future version must remove data as it shouldd not be stored clear like that
          localStorage.setItem("authData", JSON.stringify(res.data));
          localStorage.setItem("authDataToken", res.token);
          //Set the last connection  and the current. The choice was made to store the current date as last date when user login for the
          //first time
          // @ts-ignore
          localStorage.getItem("_"+res.data._username+"authCurrentLogin") ? localStorage.setItem("_"+res.data._username+"authLastLogin", localStorage.getItem("_"+res.data._username+"authCurrentLogin")) : localStorage.setItem("_"+res.data._username+"authLastLogin", new Date().toLocaleString("fr"));
          localStorage.setItem("_"+res.data._username+"authCurrentLogin", new Date().toLocaleString("fr"));
          //Redirect to feed component after registration
          this.router.navigate(['/', "feed"]).then(r => {});
          //Notify the user with his last connection and his personal information
          this.notifier.notify("success", "Vous êtes connecté.e " + res.data._nom + " " + res.data._prenom + "\nDernière connexion le : " + localStorage.getItem("_"+res.data._username+"authLastLogin"));
        },
        (error: any) => {
          //Notify user if there is an error
          this.notifier.notify("error", "("+ error.status + ") " + error.error.errorMessage);
        });
    }
    catch (e) {
      console.log(e);
    }
  }

  //Logout method used when user click on 'se déconnecter'
  async logout() {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('authDataToken')
    });
    this.options = { headers: this.headers };
    //When methods is called remove the token and the Data from the local storage
    try {
      // @ts-ignore
      const authData = JSON.parse(await localStorage.getItem('authData'));
      // @ts-ignore
      this.httpClient.post('https://pedago.univ-avignon.fr:3223/logout', {id: authData._id}, this.options).subscribe( (res: any) => {
      })
      localStorage.removeItem("authData");
      localStorage.removeItem("authDataToken");
    }
    catch (error: any) {
      this.notifier.notify("error", "("+ error.status + ") " + error.error.errorMessage);
    }
  }
}
