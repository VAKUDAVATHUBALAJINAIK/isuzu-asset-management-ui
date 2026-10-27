import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetEntry } from './asset-entry';

describe('AssetEntry', () => {
  let component: AssetEntry;
  let fixture: ComponentFixture<AssetEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetEntry],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetEntry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
