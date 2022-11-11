import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {LocalStorageTokenVoterService} from "../local-storage-token-voter.service";

@Component({
  selector: 'app-ceri-feed',
  templateUrl: './ceri-feed.component.html',
  styleUrls: ['./ceri-feed.component.scss']
})
export class CeriFeedComponent implements OnInit {

  constructor(private router: Router, private tokenChecker: LocalStorageTokenVoterService) { }

  ngOnInit(): void {
    //Check if user is authenticated, if false, redirect the user on the login component as he should
    //be authenticated to use CERISoNet
    // @ts-ignore
    this.tokenChecker.isUserFullyAuthenticated() ? null : this.router.navigate(['/', 'login']);
  }

}
