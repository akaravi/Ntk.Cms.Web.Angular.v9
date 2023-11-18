import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageContactusComponent } from './page-contactus.component';

describe('PageContactusComponent', () => {
  let component: PageContactusComponent;
  let fixture: ComponentFixture<PageContactusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageContactusComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageContactusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
