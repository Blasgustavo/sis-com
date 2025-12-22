import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reportspage } from './reportspage';

describe('Reportspage', () => {
  let component: Reportspage;
  let fixture: ComponentFixture<Reportspage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reportspage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reportspage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
