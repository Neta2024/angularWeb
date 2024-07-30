import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPaneComponent } from './event-pane.component';

describe('EventPaneComponent', () => {
  let component: EventPaneComponent;
  let fixture: ComponentFixture<EventPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventPaneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
