import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmpleadosService } from '../../../../../services/empleados.service';

@Component({
  selector: 'app-seleccion-empleados-modal',
  templateUrl: './seleccion-empleados-modal.component.html',
  styleUrl: './seleccion-empleados-modal.component.scss'
})
export class SeleccionEmpleadosModalComponent {
  cantidadArray: number[] = [];

  empleados: any[] = []; // lista total que recibes del servicio

  empleadosSeleccionados: any[] = [];

  // arrays por cada campo dinámico
  buscadores: string[] = [];
  filtrados: any[][] = [];
  mostrarLista: boolean[] = [];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SeleccionEmpleadosModalComponent>,
    private empleadosService: EmpleadosService
  ) {
    console.log(data)
    this.cantidadArray = Array.from({ length: data.cantidad }, (_, i) => i);
    // inicialización por campo
    this.empleadosSeleccionados = data.empleadosSeleccionados || [];
    this.buscadores = Array(data.cantidad).fill('');
    this.mostrarLista = Array(data.cantidad).fill(false);
    this.filtrados = Array(data.cantidad).fill([]);
  }
  ngOnInit() {
    this.getEmpleados();
  }

  getEmpleados() {
    this.empleadosService.getEmpleadosByEstablishment().subscribe(res => {
      this.empleados = res;
      this.reconstruirBuscadores();
    });
  }
  reconstruirBuscadores() {
    this.cantidadArray.forEach((_, i) => {
      const empSel = this.empleadosSeleccionados[i];

      if (empSel) {
        // Buscar el empleado en la lista real
        const empReal = this.empleados.find(e => e.id === empSel.id);

        if (empReal) {
          this.empleadosSeleccionados[i] = empReal;
          this.buscadores[i] = `${empReal.name} ${empReal.lastName}`;
        }
      }
    });
  }

  filtrar(i: number) {
    const texto = this.buscadores[i].toLowerCase().trim();

    this.filtrados[i] = this.empleados.filter(emp =>
      (emp.name + ' ' + emp.lastName).toLowerCase().includes(texto)
    );
  }

  seleccionar(i: number, emp: any) {
    this.empleadosSeleccionados[i] = emp;
    this.buscadores[i] = `${emp.name} ${emp.lastName}`;
    this.mostrarLista[i] = false;
  }

  limpiar(i: number) {
    this.empleadosSeleccionados[i] = null;
    this.buscadores[i] = '';
    this.filtrados[i] = [];
  }

  ocultarListaConRetardo(i: number) {
    setTimeout(() => this.mostrarLista[i] = false, 200);
  }



  guardar() {
    this.dialogRef.close(this.empleadosSeleccionados);
  }

  cerrar() {
    this.dialogRef.close();
  }
}
