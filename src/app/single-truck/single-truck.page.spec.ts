import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SingleTruckPage } from './single-truck.page';

describe('SingleTruckPage', () => {
  let component: SingleTruckPage;
  let fixture: ComponentFixture<SingleTruckPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleTruckPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SingleTruckPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
