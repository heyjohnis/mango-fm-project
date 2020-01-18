import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    public storage: Storage
  ) { }

  setCustomerData(cust: any): Promise<any> {

    return this.storage.set('customer', cust);
  }

  async getCustomerData(): Promise<string> {
    const value = await this.storage.get('customer');
    return value;
  }
}
