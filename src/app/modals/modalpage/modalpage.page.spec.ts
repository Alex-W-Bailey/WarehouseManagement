import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalpagePage } from './modalpage.page';

describe('ModalpagePage', () => {
  let component: ModalpagePage;
  let fixture: ComponentFixture<ModalpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalpagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
