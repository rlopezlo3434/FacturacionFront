export interface Item {
  id: number;
  item: 'Servicio' | 'Producto'; 
  description: string;
  createdAt: string;
  isActive: boolean;
}