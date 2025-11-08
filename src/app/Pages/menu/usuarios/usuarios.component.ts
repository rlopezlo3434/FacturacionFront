import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../../services/cliente.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {

  facturas: any[] = [];
  constructor(private clienteSerivce: ClienteService){

  }

  ngOnInit(): void {
      
  }

 
}
