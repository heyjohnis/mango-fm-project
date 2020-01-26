import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnonymousLoginPage } from './anonymous-login.page';

describe('AnonymousLoginPage', () => {
  let component: AnonymousLoginPage;
  let fixture: ComponentFixture<AnonymousLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnonymousLoginPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnonymousLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
