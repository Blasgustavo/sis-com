import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Exportspage } from './exportspage';

describe('Exportspage', () => {
  let component: Exportspage;
  let fixture: ComponentFixture<Exportspage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Exportspage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Exportspage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
