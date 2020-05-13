import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TruckItemPage } from './truck-item.page';

describe('TruckItemPage', () => {
  let component: TruckItemPage;
  let fixture: ComponentFixture<TruckItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckItemPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TruckItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
