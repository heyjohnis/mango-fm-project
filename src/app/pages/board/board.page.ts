import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../providers/api/api';

@Component({
  selector: 'board',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage implements OnInit {

  public contents: any;

  constructor(
      private router: Router,
      private api: Api

    ) { }

  ngOnInit() {
    this.getContents();
  }

  getContents(){
    let formData = new FormData();
    formData.append("board_id", '1');
    formData.append("title", '');
    formData.append("content", '1');
    this.api.post('board/list', formData).subscribe((data)=>{
      this.contents = data;
    })
  }

	gotoDetail(seq) {
		this.router.navigate(['/board/detail' ,{seq : seq}]);
  }
  

}
