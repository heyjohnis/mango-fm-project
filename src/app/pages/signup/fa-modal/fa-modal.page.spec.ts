import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FaModalPage } from './fa-modal.page';

describe('FaModalPage', () => {
  let component: FaModalPage;
  let fixture: ComponentFixture<FaModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FaModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
