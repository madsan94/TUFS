import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms'
import { RestService } from '../rest.service'
import { ActivatedRoute, Router } from '@angular/router'
import { User } from './login'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [ RestService ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form;
  constructor(private restservice: RestService) { }

ngOnInit() {
this.form=new FormGroup({
  name: new FormControl('',Validators.compose([
    Validators.pattern('[\\w\\-\\s\\/]+'),
    Validators.required
])),
  email:new FormControl('',Validators.compose([
    Validators.pattern('\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b'),
    Validators.required])),
  password: new FormControl('',Validators.compose([
    Validators.pattern('(?=.*[A-Z])'),
    Validators.pattern('(?=.*[0-9])')
  ])),
  confirm_password: new FormControl('')
  });
  }

onSubmit(signup_details){
  console.log(signup_details)
  const NewUser: User = { "name":signup_details.name,"email":signup_details.email,"password":signup_details.password } as User;
  this.restservice.Signup(NewUser).subscribe()
}

}
