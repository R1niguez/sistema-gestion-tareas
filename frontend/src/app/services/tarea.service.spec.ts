import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TareaService } from './tarea.service';

describe('TareaService', () => {
  let service: TareaService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [TareaService, provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(TareaService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('lista tareas mediante GET', () => {
    service.listar().subscribe((tareas) => expect(tareas.length).toBe(1));
    const request = http.expectOne('http://localhost:3000/api/tareas');
    expect(request.request.method).toBe('GET');
    request.flush([{ id: 1, titulo: 'Tarea', descripcion: '', estado: 'pendiente' }]);
  });

  it('crea tareas mediante POST', () => {
    const tarea = { titulo: 'Nueva', descripcion: '', estado: 'pendiente' as const };
    service.crear(tarea).subscribe((resultado) => expect(resultado.id).toBe(1));
    const request = http.expectOne('http://localhost:3000/api/tareas');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(tarea);
    request.flush({ id: 1, ...tarea });
  });
});
