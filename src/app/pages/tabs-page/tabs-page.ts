import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage implements OnInit {

  public custLogin = false;

  async ngOnInit() {
    window.addEventListener('user:login_code', () => {
      console.log("listenForLoginEvents : login_code"); 
      this.custLogin = true;
    });   
  }
}
