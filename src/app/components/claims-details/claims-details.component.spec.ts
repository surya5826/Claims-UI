import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsDetailsComponent } from './claims-details.component';

describe('ClaimsDetailsComponent', () => {
  let component: ClaimsDetailsComponent;
  let fixture: ComponentFixture<ClaimsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimsDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
