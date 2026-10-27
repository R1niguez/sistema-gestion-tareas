import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstadoTarea, NuevaTarea, Tarea, TareaService } from './services/tarea.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private readonly tareaService = inject(TareaService);
  readonly estados: EstadoTarea[] = ['pendiente', 'en progreso', 'completada'];
  tareas: Tarea[] = [];
  formulario: NuevaTarea = { titulo: '', descripcion: '', estado: 'pendiente' };
  editandoId: number | null = null;
  mensaje = '';
  error = '';

  ngOnInit(): void { this.cargarTareas(); }

  cargarTareas(): void {
    this.tareaService.listar().subscribe({
      next: (tareas) => { this.tareas = tareas; this.error = ''; },
      error: () => { this.error = 'No se pudieron cargar las tareas.'; },
    });
  }

  guardar(): void {
    const operacion = this.editandoId === null
      ? this.tareaService.crear(this.formulario)
      : this.tareaService.actualizar(this.editandoId, this.formulario);
    operacion.subscribe({
      next: () => {
        this.mensaje = this.editandoId === null ? 'Tarea creada.' : 'Tarea actualizada.';
        this.cancelarEdicion();
        this.cargarTareas();
      },
      error: () => { this.error = 'No se pudo guardar la tarea.'; },
    });
  }

  editar(tarea: Tarea): void {
    this.editandoId = tarea.id;
    this.formulario = { titulo: tarea.titulo, descripcion: tarea.descripcion, estado: tarea.estado };
    this.mensaje = '';
  }

  eliminar(id: number): void {
    if (!window.confirm('¿Desea eliminar esta tarea?')) return;
    this.tareaService.eliminar(id).subscribe({
      next: () => { this.mensaje = 'Tarea eliminada.'; this.cargarTareas(); },
      error: () => { this.error = 'No se pudo eliminar la tarea.'; },
    });
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.formulario = { titulo: '', descripcion: '', estado: 'pendiente' };
  }
}
