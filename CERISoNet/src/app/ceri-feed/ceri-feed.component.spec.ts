import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeriFeedComponent } from './ceri-feed.component';

describe('CeriFeedComponent', () => {
  let component: CeriFeedComponent;
  let fixture: ComponentFixture<CeriFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CeriFeedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CeriFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
