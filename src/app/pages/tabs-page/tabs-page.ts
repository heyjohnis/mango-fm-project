import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage implements OnInit {

  public custLogin = false;

  async ngOnInit() {
    window.addEventListener('user:00', () => {
      console.log("listenForLoginEvents : login_code"); 
      this.custLogin = true;
    });   
    window.addEventListener('user:01', () => {
      console.log("listenForLoginEvents : 고객"); 
      this.custLogin = true;
    });   
  }
}
