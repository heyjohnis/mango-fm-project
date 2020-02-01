import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserManageDetailPage } from './user-manage-detail.page';

describe('UserManageDetailPage', () => {
  let component: UserManageDetailPage;
  let fixture: ComponentFixture<UserManageDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserManageDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserManageDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
