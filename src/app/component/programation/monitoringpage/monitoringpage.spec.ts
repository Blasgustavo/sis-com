import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Monitoringpage } from './monitoringpage';

describe('Monitoringpage', () => {
  let component: Monitoringpage;
  let fixture: ComponentFixture<Monitoringpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Monitoringpage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Monitoringpage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
