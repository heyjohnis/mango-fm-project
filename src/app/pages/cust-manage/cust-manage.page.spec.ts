import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustManagePage } from './cust-manage.page';

describe('CustManagePage', () => {
  let component: CustManagePage;
  let fixture: ComponentFixture<CustManagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustManagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustManagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
