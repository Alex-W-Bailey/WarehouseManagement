import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TruckloadPage } from './truckload.page';

describe('TruckloadPage', () => {
  let component: TruckloadPage;
  let fixture: ComponentFixture<TruckloadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckloadPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TruckloadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
