import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuInstallPwaIosComponent } from './menu-install-pwa-ios.component';

describe('MenuInstallPwaIosComponent', () => {
  let component: MenuInstallPwaIosComponent;
  let fixture: ComponentFixture<MenuInstallPwaIosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuInstallPwaIosComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuInstallPwaIosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
