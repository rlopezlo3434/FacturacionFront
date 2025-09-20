export interface MenuItem {
  label: string;
  name?: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
  open?: boolean; 
}