import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateListPage } from './date-list.page';

describe('DateListPage', () => {
  let component: DateListPage;
  let fixture: ComponentFixture<DateListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
