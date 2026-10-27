import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMaintenece } from './asset-maintenece';

describe('AssetMaintenece', () => {
  let component: AssetMaintenece;
  let fixture: ComponentFixture<AssetMaintenece>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetMaintenece],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetMaintenece);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
