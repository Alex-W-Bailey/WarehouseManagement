import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InboundPage } from './inbound.page';

describe('InboundPage', () => {
  let component: InboundPage;
  let fixture: ComponentFixture<InboundPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InboundPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InboundPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
