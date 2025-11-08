export interface Item {
  id: number;
  item: 'Servicio' | 'Producto'; 
  description: string;
  value: number;
  createdAt: string;
  isActive: boolean;
}


export interface ItemVenta {
  id: number;
  item: string;
  code: string;
  description: string;
  cantidad: number;
  value: number; // Precio unitario CON IGV
  isActive?: boolean;
  subtotal?: number; // Sin IGV
  igv?: number;      // IGV por ítem
  total?: number;    // Total con IGV (value * cantidad)
}