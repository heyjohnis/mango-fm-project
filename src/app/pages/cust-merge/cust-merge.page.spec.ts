import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustMergePage } from './cust-merge.page';

describe('CustMergePage', () => {
  let component: CustMergePage;
  let fixture: ComponentFixture<CustMergePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustMergePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustMergePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
