import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransfer } from './asset-transfer';

describe('AssetTransfer', () => {
  let component: AssetTransfer;
  let fixture: ComponentFixture<AssetTransfer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetTransfer],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetTransfer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
