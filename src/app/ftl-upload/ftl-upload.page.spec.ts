import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FtlUploadPage } from './ftl-upload.page';

describe('FtlUploadPage', () => {
  let component: FtlUploadPage;
  let fixture: ComponentFixture<FtlUploadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FtlUploadPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FtlUploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
