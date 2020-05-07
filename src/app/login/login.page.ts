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

  toggledRememberLogin: boolean = false;

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  AttemptLogin() {
    const {username, password} = this;

    console.log("username: ", username + " password: ", password);

    if(username === "" || username == undefined) {
      this.showError("username", "Username Is Required!");      
    }
    else if(password === "" || password == undefined) {
      this.showError("password", "Password Is Required!");      
    }
    else {
      this.hideError();

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

  showError(elementErr, errMsg) {
    var usernameIonItem = document.getElementById("ion-username");
    var passwordIonItem = document.getElementById("ion-password");

    var errorSection = document.getElementById("error-section");
    var errorText = document.getElementById("error-text");

    errorSection.classList.remove("hide");
    errorText.innerHTML = errMsg;
    
    if(elementErr == "username") {
      usernameIonItem.classList.add("input-err");
      passwordIonItem.classList.remove("input-err");
    }
    else {
      usernameIonItem.classList.remove("input-err");
      passwordIonItem.classList.add("input-err");
    }
  }

  hideError() {
    var usernameIonItem = document.getElementById("ion-username");
    var passwordIonItem = document.getElementById("ion-password");

    var errorSection = document.getElementById("error-section");
    var errorText = document.getElementById("error-text");

    usernameIonItem.classList.remove("input-err");
    passwordIonItem.classList.remove("input-err");
    errorSection.classList.add("hide");
  }

  toggleRemember() {
    var btn = document.getElementById("toggleRememberBtn");

    if(this.toggledRememberLogin === false) {
      this.toggledRememberLogin = true;
      btn.classList.remove("white-text");
      btn.classList.add("green-text");
    }
    else {
      this.toggledRememberLogin = false
      btn.classList.remove("green-text");
      btn.classList.add("white-text");
    }

    console.log("toggled set to: " + this.toggledRememberLogin);
  }
}
