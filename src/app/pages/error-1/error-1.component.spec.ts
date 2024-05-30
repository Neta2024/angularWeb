/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Error-1Component } from './error-1.component';

describe('Error-1Component', () => {
  let component: Error-1Component;
  let fixture: ComponentFixture<Error-1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Error-1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Error-1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
