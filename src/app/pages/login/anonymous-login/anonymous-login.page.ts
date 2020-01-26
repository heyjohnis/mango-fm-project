import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'anonymous-login',
  templateUrl: './anonymous-login.page.html',
  styleUrls: ['./anonymous-login.page.scss'],
})
export class AnonymousLoginPage implements OnInit {

  constructor() { }

  ngOnInit() {
    
  }

  authAnonymous(){
    firebase.auth().signInAnonymously().then((result) => {
      console.log("inanoymous result : ", result);
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error);

      // ...
    });
  }

}
