import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentAssets } from './recent-assets';

describe('RecentAssets', () => {
  let component: RecentAssets;
  let fixture: ComponentFixture<RecentAssets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentAssets],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentAssets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
