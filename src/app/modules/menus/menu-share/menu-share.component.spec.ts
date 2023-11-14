import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuShareComponent } from './menu-share.component';

describe('MenuShareComponent', () => {
  let component: MenuShareComponent;
  let fixture: ComponentFixture<MenuShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuShareComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
