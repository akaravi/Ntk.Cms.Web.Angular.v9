import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuColorsComponent } from './menu-colors.component';

describe('MenuColorsComponent', () => {
  let component: MenuColorsComponent;
  let fixture: ComponentFixture<MenuColorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuColorsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
