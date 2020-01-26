import { Injectable } from '@angular/core';
import * as Kakao from '../../assets/js/kakao.min';
import * as _ from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class UtilService {

	constructor() { }

	dataSort(data, key, order) : any {
		let direct = order == 'desc' ? -1 : 1;
		let sort_data = data.sort((a, b) => {
			if(key == 'cust_nm' || key == 'reg_date') return a[key] > b[key] ? direct : direct * -1;
			else return Number(a[key]) > Number(b[key]) ? direct : direct * -1;
		});
		return sort_data;
	}

	getYYYYMMList(cnt): any{
        let today = new Date();
        let this_month = today.getMonth();
        let this_year = today.getFullYear();
        let month_list = [];
        let lenth	= cnt / 12 + 1;
        for(let year = this_year ; year > this_year-lenth; year--) {
            for(let month = 12; month > 0; month -- ) {
            if(year == this_year && month > this_month + 1) continue; 
            month_list.push(year + this.pad(month, 2));
            }
        }
        return month_list.slice(0,cnt);
    }

    pad(n, width) {
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
	}
	
    setMonthlyData(data, cnt): any{
		let monthly_data_group_by = _.groupBy(data, 'balance_date_group', 'desc');
		console.log("monthly_data_group_by : ", monthly_data_group_by);
        // YYYYMM 연월리스트
        let monthy_list: any = this.getYYYYMMList(cnt);
        let headers = [];
        monthy_list.forEach(month => {
            let get_header = null;
            if(monthly_data_group_by[month] != undefined) get_header = monthly_data_group_by[month][0];
            headers.push({month: month, header: get_header});
        });
        headers.forEach((data, idx) => {
            if(data.header == null && idx > 0) headers[idx].header = headers[idx - 1].header;
        });
        return headers;
    }


    shareKakao(date, account, rate, uri, image_url){
        console.log("kakao image url : ",image_url);
        Kakao.Link.createDefaultButton({
        container: '#kakao-link-btn',
        objectType: 'feed',
        content: {
            title: '고객님의 자산현황',
            description: `기준일: ${this.setDataHyphen(date)} \n총자산: ${this.setComma(account)} / 수익률: ${rate}` ,
            imageUrl:`${image_url}`,
            link: {
            mobileWebUrl:`${uri}`
            }
        },
        buttons: [
            {
                title: '상세정보 보기',
                link: {
                    mobileWebUrl: `${uri}`
                }
            }
        ]
        });
    }


    setComma(num)  {
        var regexp = /\B(?=(\d{3})+(?!\d))/g;
        return num.toString().replace(regexp, ',');
    }

    setDataHyphen(date)  {
        let year = date.substring(0, 4);
        let month = date.substring(4,6);
        let day = date.substring(6,8);
        return year + '-' + month + '-' + day;
    }

	

}
