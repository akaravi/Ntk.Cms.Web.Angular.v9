import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuInstallPwaAndroidComponent } from './menu-install-pwa-android.component';

describe('MenuInstallPwaAndroidComponent', () => {
  let component: MenuInstallPwaAndroidComponent;
  let fixture: ComponentFixture<MenuInstallPwaAndroidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuInstallPwaAndroidComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuInstallPwaAndroidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
