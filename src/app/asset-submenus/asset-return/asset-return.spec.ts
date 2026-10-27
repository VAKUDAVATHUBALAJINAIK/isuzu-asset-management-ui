import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetReturn } from './asset-return';

describe('AssetReturn', () => {
  let component: AssetReturn;
  let fixture: ComponentFixture<AssetReturn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetReturn],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetReturn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
