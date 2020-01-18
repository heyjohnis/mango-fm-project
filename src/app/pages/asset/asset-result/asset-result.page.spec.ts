import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetResultPage } from './asset-result.page';

describe('AssetResultPage', () => {
  let component: AssetResultPage;
  let fixture: ComponentFixture<AssetResultPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetResultPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
