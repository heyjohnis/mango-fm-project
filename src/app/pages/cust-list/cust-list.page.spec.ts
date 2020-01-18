import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustListPage } from './cust-list.page';

describe('CustListPage', () => {
  let component: CustListPage;
  let fixture: ComponentFixture<CustListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
