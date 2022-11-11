import { Component, OnInit, Input } from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {LocalStorageTokenVoterService} from "../local-storage-token-voter.service";

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.scss']
})
export class FormLoginComponent implements OnInit {

  //Vars used in this component's form
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router, private tokenChecker: LocalStorageTokenVoterService) { }

  ngOnInit(): void {
    //Check if user is authenticated, if true, redirect the user on the feed component as he should
    //not be able to login again
    this.tokenChecker.isUserFullyAuthenticated() ? this.router.navigate(['/', 'feed']) : null;
  }

  //Methods bind to the submit button, it's job is to call the AuthService's method login.
  onSubmit() {
    this.authService.login(this.username, this.password);
  }
}
