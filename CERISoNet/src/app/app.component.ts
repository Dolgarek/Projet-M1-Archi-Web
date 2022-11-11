import {Component, OnInit} from '@angular/core';
import {LocalStorageTokenVoterService} from "./local-storage-token-voter.service";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {faUser} from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  //Define the variable
  title = 'CERISoNet'; //Website's title
  token: boolean | undefined; //Token exist or not
  faUser = faUser; //Fa icon

  //Inject services and module from within the constructor.
  //LocalStorageTokenVoterService = check if token exist in local storage to handle redirection
  //Router handle redirection
  //AuthService handle login and logout methods
  constructor(private tokenChecker: LocalStorageTokenVoterService, private router: Router, private auth: AuthService) {
  }

  //Nothing on init
  ngOnInit(): void {

  }

  //all the AuthService logout method then redirect to default page (login page)
  logout() {
      this.auth.logout();
      this.router.navigate(['/']);
  }

  //Used to indicate if navabar should be visible or not
  isNavShown() {
    return this.tokenChecker.isUserFullyAuthenticated();
  }

}
