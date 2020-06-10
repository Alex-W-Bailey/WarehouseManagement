import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OutboundPage } from './outbound.page';

describe('OutboundPage', () => {
  let component: OutboundPage;
  let fixture: ComponentFixture<OutboundPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutboundPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OutboundPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
