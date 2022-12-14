import {Component, OnInit} from '@angular/core';
import {LocalStorageTokenVoterService} from "./local-storage-token-voter.service";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {faUser} from "@fortawesome/free-regular-svg-icons";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Socket} from "ngx-socket-io";

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
  constructor(private tokenChecker: LocalStorageTokenVoterService, private router: Router, private auth: AuthService, private modalService: NgbModal, private socket: Socket) {
  }

  closeResult = '';
  public loggedUser: any;

  //Nothing on init
  ngOnInit(): void {
    this.loggedUser = [];
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

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  listConnectedUser(): any {
    return this.socket.fromEvent('logged-user-event');
  }
}
