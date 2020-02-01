import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../../providers/api/api';

@Component({
  selector: 'board-detail',
  templateUrl: './board-detail.page.html',
  styleUrls: ['./board-detail.page.scss'],
})
export class BoardDetailPage implements OnInit {

  private seq: string;
  private title: string;
  private content: string;
  private img_url: string = "";
  private reg_date: string;

  constructor(
    private route: ActivatedRoute,
    private api: Api,
    private router: Router
  ) { }

  ngOnInit() {
    this.seq = this.route.snapshot.paramMap.get('seq');
    this.getContent();
  }

  getContent(){
    let fdata = new FormData();
    fdata.append('seq', this.seq);
    this.api.post('/board/detail', fdata).subscribe((data)=>{
      this.setContent(data);
    });


  }

  setContent(data){
    this.title = data.title;
    this.content = data.content;
    let domain = '';
    this.img_url = domain + data.file_nm;
    this.reg_date = data.reg_date;
  }

  gotoEdit(seq) {
		this.router.navigate(['/board/edit' ,{seq : seq}]);
	}
}
