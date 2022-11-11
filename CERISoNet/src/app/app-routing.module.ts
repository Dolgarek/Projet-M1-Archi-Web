import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormLoginComponent} from './form-login/form-login.component'
import {CeriFeedComponent} from "./ceri-feed/ceri-feed.component";
//Define the different route existing in the application
const routes: Routes = [
  {path: '',pathMatch: 'full' ,redirectTo: 'login'}, //Base route (/) redirect user to the login route
  {path: 'login', component: FormLoginComponent},
  {path: 'feed', component: CeriFeedComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
