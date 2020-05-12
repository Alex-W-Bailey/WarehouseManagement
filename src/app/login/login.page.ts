import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username: string = "";
  password: string = "";

  toggledRememberLogin: boolean = false;
  isLoginInfoRemembered: boolean = false;

  constructor(private api: ApiService, private loadingController: LoadingController) { }

  ngOnInit() {
    this.checkAutoLogin()
  }

  async checkAutoLogin() {
    await this.getRememberedLoginInfo();

    console.log("is login remembered: " + this.isLoginInfoRemembered);

    if (this.isLoginInfoRemembered === true) {
      this.attemptRememberedLogin();
    }
  }

  login() {
    const { username, password } = this;
    this.attemptLogin(username, password, false);
  }

  async attemptRememberedLogin() {
    var user_data = await this.getUserLoginData();
    this.attemptLogin(user_data.username, user_data.password, true);
  }

  async getUserLoginData() {
    const { value } = await Storage.get({ key: "catalog_login" });
    var user_data = JSON.parse(value);

    var loginInfo = {
      username: user_data.user_id,
      password: user_data.password
    }

    return loginInfo;
  }


  attemptLogin(username, password, autoLoginVal) {
    console.log("username: ", username + " password: ", password);

    if (username === "" || username == undefined) {
      this.showError("username", "Username Is Required!");
    }
    else if (password === "" || password == undefined) {
      this.showError("password", "Password Is Required!");
    }
    else {
      this.doLogin(username, password, autoLoginVal);
    }
  }

  async doLogin(username, password, autoLoginVal) {
    const loading = await this.loadingController.create({})
    loading.present();

    this.hideError();

    this.api.attemptLogin(username, password).subscribe(async (result) => {
      var userInfo = result[0];

      if (userInfo) {
        await this.checkToSaveInfo(userInfo, autoLoginVal);
        window.location.href = "/home";
        loading.dismiss();
      }
      else {
        loading.dismiss();
        this.showError("", "Username Or Password Is Incorrect");
      }
    });
  }

  async checkToSaveInfo(userInfo, autoLogin) {
    if(autoLogin == false) {
      if (this.toggledRememberLogin ==   true) {
        console.log(userInfo);
        this.setLoginInfo("true", userInfo);
      }
      else {
        this.setLoginInfo("false", "");
        console.log("don't remember");
      }
    }
  }

  showError(elementErr, errMsg) {
    var usernameIonItem = document.getElementById("ion-username");
    var passwordIonItem = document.getElementById("ion-password");

    var errorSection = document.getElementById("error-section");
    var errorText = document.getElementById("error-text");

    errorSection.classList.remove("hide");
    errorText.innerHTML = errMsg;

    if (elementErr == "username") {
      usernameIonItem.classList.add("input-err");
      passwordIonItem.classList.remove("input-err");
    }
    else if (elementErr == "password") {
      usernameIonItem.classList.remove("input-err");
      passwordIonItem.classList.add("input-err");
    }
    else {
      usernameIonItem.classList.remove("input-err");
      passwordIonItem.classList.remove("input-err");
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
    errorText.innerHTML = "";
  }

  toggleRemember() {
    var btn = document.getElementById("toggleRememberBtn");

    if (this.toggledRememberLogin === false) {
      this.toggledRememberLogin = true;
      btn.classList.remove("white-text");
      btn.classList.add("green-text");
    }
    else {
      this.toggledRememberLogin = false
      btn.classList.remove("green-text");
      btn.classList.add("white-text");
    }
  }

  async setLoginInfo(saveLogin, userToSave) {
    console.log(userToSave);

    await this.setRememberLogin(saveLogin);
    await this.saveLoginInfo(userToSave);
  }

  async setRememberLogin(valueToSet) {
    await Storage.set({
      key: "catalog_remember_login",
      value: valueToSet
    });
  }

  async saveLoginInfo(userInfo) {
    if (userInfo !== "") {
      this.save(userInfo);
    }
  }

  async save(userInfo) {
    await Storage.set({
      key: "catalog_login",
      value: JSON.stringify(userInfo)
    });
  }

  async getRememberedLoginInfo() {
    const { value } = await Storage.get({ key: "catalog_remember_login" });
    console.log("saved value: " + value);

    if (value == "true") {
      this.isLoginInfoRemembered = true;
    }
    else if (value == "false") {
      this.isLoginInfoRemembered = false
    }
  }
}
