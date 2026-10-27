import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type EstadoTarea = 'pendiente' | 'en progreso' | 'completada';

export interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  estado: EstadoTarea;
}

export type NuevaTarea = Omit<Tarea, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class TareaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/tareas';

  listar(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl);
  }

  obtener(id: number): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.apiUrl}/${id}`);
  }

  crear(tarea: NuevaTarea): Observable<Tarea> {
    return this.http.post<Tarea>(this.apiUrl, tarea);
  }

  actualizar(id: number, tarea: NuevaTarea): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.apiUrl}/${id}`, tarea);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
