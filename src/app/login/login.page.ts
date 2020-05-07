import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string = "";
  password: string = "";

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  AttemptLogin() {
    const {username, password} = this;

    console.log("username: ", username + " password: ", password);

    var usernameIonItem = document.getElementById("ion-username");
    var passwordIonItem = document.getElementById("ion-password");

    if(username === "" || username == undefined) {
      console.log("username blank... val: " + username);

      usernameIonItem.classList.add("input-err");
    }
    else if(password === "" || password == undefined) {
      console.log("password blank... val: " + password);
      
      usernameIonItem.classList.remove("input-err");
      passwordIonItem.classList.add("input-err");
    }
    else {
      usernameIonItem.classList.remove("input-err");
      passwordIonItem.classList.remove("input-err");

      this.api.attemptLogin(username, password).subscribe((result) => {
        var userInfo = result[0];
        if (userInfo) {
          window.location.href = "/home";
        }
        else {
          console.log("error");
        }
      });
    }
  } 
}
