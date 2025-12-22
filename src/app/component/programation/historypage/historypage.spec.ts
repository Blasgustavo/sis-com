import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Historypage } from './historypage';

describe('Historypage', () => {
  let component: Historypage;
  let fixture: ComponentFixture<Historypage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Historypage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Historypage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
