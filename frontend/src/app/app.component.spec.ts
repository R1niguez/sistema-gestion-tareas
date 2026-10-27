import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AppComponent], providers: [provideHttpClient(), provideHttpClientTesting()] }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    fixture.componentInstance.tareas = [];
    fixture.detectChanges();
  });
  it('muestra el título del sistema', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Sistema de Gestión de Tareas');
  });
});
