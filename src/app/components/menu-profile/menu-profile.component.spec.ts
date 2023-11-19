import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuProfileComponent } from './menu-profile.component';


describe('MenuProfileComponent', () => {
  let component: MenuProfileComponent;
  let fixture: ComponentFixture<MenuProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuProfileComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
