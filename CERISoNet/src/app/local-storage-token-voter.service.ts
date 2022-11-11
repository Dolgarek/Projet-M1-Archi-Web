import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageTokenVoterService {

  constructor() { }

  //Method used to check if token exist in localStorage
  //The choice was made to create a service to avoid code duplication
  isUserFullyAuthenticated() {
    let isAuthenticate: boolean = false;
    localStorage.getItem("authDataToken") ? isAuthenticate = true : isAuthenticate = false;
    return isAuthenticate;
  }
}
