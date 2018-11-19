import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { EventEmitter } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  events: any = new EventEmitter();

  constructor(private storage: LocalStorageService) {

  }

  doLoginWithEmaillPassword(credentials: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const loginResponse: any = await firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password);
        await this.storage.store('user', loginResponse.user);
        return resolve(loginResponse);
      } catch (error) {
        return reject(error);
      }
    });
  }

  doRegisterWithEmaillPassword(newUser: any) {
    return new Promise(async (resolve, reject) => {
      if (newUser.password !== newUser.repeatPassword)
        return reject('passwords_not_same');
      else
        try {
          const registerResponse: any = await firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
          await this.storage.store('user', registerResponse.user);
          return resolve(registerResponse);
        } catch (error) {
          return reject(error);
        }
    });
  }

  doLoginWithGoogle() { // NOT IN USE
    return new Promise(async (resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();

      await firebase.auth().signInWithRedirect(provider).then((result: any) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const token = result.credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        return resolve(user);

      }).catch(function (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
        return reject(error);
      });

    });
  }

  async isAuthenticated(): Promise<Boolean> {
    const user: any = await this.storage.retrieve('user');
    if (user && user.email)
      return Promise.resolve(true);
    else
      return Promise.resolve(false);
  }


  async getUser(): Promise<any> {
    const user: any = await this.storage.retrieve('user');
    return Promise.resolve(user);
  }

  async doLogout(): Promise<any> {
    await this.storage.clear('user');
    return Promise.resolve();
  }
}
