import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClienteService } from '../../../../../../services/cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CatalogosService } from '../../../../../../services/catalogos.service';

@Component({
  selector: 'app-modal-clientes-dialog',
  templateUrl: './modal-clientes-dialog.component.html',
  styleUrl: './modal-clientes-dialog.component.scss'
})
export class ModalClientesDialogComponent {
  cli: any = {};
  password = '';
  hide = true;
  roleCode: string | null = null;
  catalogDocument: any[] = [];
  catalogGender: any[] = [];
  catalogContactTypes: any[] = [];

  selectedContactTypeId: number | null = null;
  selectedDocumentTypeId: number | null = null;
  selectedGenderId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<ModalClientesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar,
    private cataService: CatalogosService
  ) {

    this.getCatalogos();

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    this.roleCode = user?.roleCode;
    if (data) {
      // Editar
      console.log(data)
      this.cli = { ...data };

      this.selectedDocumentTypeId = this.cli.documentIdentificationType?.id ?? null;
      this.selectedGenderId = this.cli.gender?.id ?? null;
      this.cli.numbers = (this.cli.numbers || []).map((n: any) => ({
        ...n,
        type: n.type
      }))

      console.log(this.cli)

    } else {
      // Crear
      this.cli = {
        names: '',
        documentIdentificationNumber: '',
        email: '',
        gender: '',
        acceptsMarketing: false,
        numbers: []
      };

      this.selectedDocumentTypeId = null;
      this.selectedGenderId = null;
    }
  }

  getCatalogos() {
    this.catalogDocumentType();
    this.catalogGenderType();
    this.catalogContactType();
  }

  catalogDocumentType() {
    this.cataService.getCatalogTypeDocument().subscribe((data) => {
      this.catalogDocument = data;
    });
  }

  catalogGenderType() {
    this.cataService.getCatalogGender().subscribe((data) => {
      this.catalogGender = data;
    });
  }

  catalogContactType() {
    this.cataService.getCatalogoContactTypes().subscribe((data) => {
      this.catalogContactTypes = data;
    });
  }

  addNumber() {
    if (!this.cli.numbers) this.cli.numbers = [];

    this.cli.numbers.push({
      contactName: '',
      type: null,
      number: '',
      isPrimary: this.cli.numbers.length === 0
    });
  }

  removeNumber(index: number) {
    this.cli.numbers.splice(index, 1);

    // Si borraron el principal y aún hay números, setea otro como principal
    if (this.cli.numbers.length > 0 && !this.cli.numbers.some((x: any) => x.isPrimary)) {
      this.cli.numbers[0].isPrimary = true;
    }
  }

  setPrimary(index: number) {
    this.cli.numbers.forEach((x: any, i: number) => {
      x.isPrimary = i === index;
    });
  }

  guardar() {

    const documentTypeSelected = this.catalogDocument.find(x => x.id === this.selectedDocumentTypeId);
    const genderSelected = this.catalogGender.find(x => x.id === this.selectedGenderId);

    const cliente = {
      names: this.cli.names,
      documentIdentificationNumber: this.cli.documentIdentificationNumber,
      documentIdentificationType: documentTypeSelected.id,
      gender: genderSelected.id,
      email: this.cli.email,
      acceptsMarketing: this.cli.acceptsMarketing || false,
      numbers: this.cli.numbers
    };

    // creación o edición
    const accion = this.data
      ? this.clienteService.updateCliente(this.cli.id, cliente)
      : this.clienteService.createCliente(cliente);

    const mensajeAccion = this.data ? 'actualizado' : 'creado';

    accion.subscribe({
      next: (response: any) => {
        const success = response?.success;
        const message = response?.message || `Cliente ${mensajeAccion} correctamente`;

        this.snackBar.open(message, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: [success ? 'success-snackbar' : 'error-snackbar']
        });

        if (success) this.dialogRef.close(true);
      },
      error: (error) => {
        console.error(`Error al ${mensajeAccion} cliente:`, error);
        this.snackBar.open(error.error?.message || `Error al ${mensajeAccion} cliente`, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  cancelar() {
    this.dialogRef.close();
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  consultarDocumento() {
    const documentTypeSelected = this.catalogDocument.find(x => x.id === this.selectedDocumentTypeId);
    console.log(this.cli);
    this.clienteService.consultarDocumento(documentTypeSelected?.name, this.cli.documentIdentificationNumber)
      .subscribe({
        next: (response: any) => {

          // 1️⃣ Validar error del backend
          if (response?.message === 'not found') {
            this.snackBar.open(
              'No se encontraron datos para el documento proporcionado',
              '',
              {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: ['error-snackbar']
              }
            );
            return; // IMPORTANTE: detener el flujo
          }

          const fullName = `${response?.first_name ?? ''} ${response?.first_last_name ?? ''}`.trim();

          this.cli.names = fullName || response?.razon_social || '';
          // 2️⃣ Si sí existen datos, llenar el formulario
          // this.cli.names = response.first_name + ' ' + response.first_last_name || response.razon_social || '';
          // this.cli.lastName = response.first_last_name || '';

          this.snackBar.open(
            'Datos del documento cargados correctamente',
            '',
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            }
          );
        },

        // 3️⃣ Si es un error HTTP (404, 500, etc.)
        error: (err) => {
          this.snackBar.open(
            'Error al consultar el documento',
            '',
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            }
          );
        }
      });
  }

}
