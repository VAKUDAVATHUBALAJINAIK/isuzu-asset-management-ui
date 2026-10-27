import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDisposal } from './asset-disposal';

describe('AssetDisposal', () => {
  let component: AssetDisposal;
  let fixture: ComponentFixture<AssetDisposal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetDisposal],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetDisposal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
