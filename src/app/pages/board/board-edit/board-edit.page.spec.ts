import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BoardEditPage } from './board-edit.page';

describe('BoardEditPage', () => {
  let component: BoardEditPage;
  let fixture: ComponentFixture<BoardEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BoardEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
