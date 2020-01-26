import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyAssetPage } from './my-asset.page';

describe('MyAssetPage', () => {
  let component: MyAssetPage;
  let fixture: ComponentFixture<MyAssetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAssetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyAssetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
