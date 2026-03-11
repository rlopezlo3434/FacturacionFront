import { Component } from '@angular/core';
import { DashboardService } from '../../../../../services/dashboard.service';
import { ApexAxisChartSeries, ApexChart, ApexPlotOptions, ApexXAxis } from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard-owner',
  templateUrl: './dashboard-owner.component.html',
  styleUrl: './dashboard-owner.component.scss'
})
export class DashboardOwnerComponent {
  // =========================
  // KPIs
  // =========================
  kpis: any;
  fecha: string = new Date().toISOString().substring(0, 10);
  chartReady = false;
  chartReady2= false;
  chartReady3 = false;
  chartReady4 = false;

  mesSeleccionado: number = new Date().getMonth();

  meses = [
    { value: 0, label: 'Enero' },
    { value: 1, label: 'Febrero' },
    { value: 2, label: 'Marzo' },
    { value: 3, label: 'Abril' },
    { value: 4, label: 'Mayo' },
    { value: 5, label: 'Junio' },
    { value: 6, label: 'Julio' },
    { value: 7, label: 'Agosto' },
    { value: 8, label: 'Septiembre' },
    { value: 9, label: 'Octubre' },
    { value: 10, label: 'Noviembre' },
    { value: 11, label: 'Diciembre' }
  ];


  topEstilistas: any[] = [
    { estilista: 'Estilista 1', cantidad: 1200, importe: 15000, establecimiento: 'Establecimiento A' },
    { estilista: 'Estilista 2', cantidad: 1100, importe: 14000, establecimiento: 'Establecimiento B' },
    { estilista: 'Estilista 3', cantidad: 900, importe: 12000, establecimiento: 'Establecimiento C' }
  ];
  // =========================
  // CHART CONFIG
  // =========================
  barChart: ApexChart = {
    type: 'bar',
    height: 300,
    toolbar: { show: false }
  };

  lineChart: ApexChart = {
    type: 'line',
    height: 300,
    toolbar: { show: false }
  };

  plotOptionsBar: ApexPlotOptions = {
    bar: {
      distributed: true,
      borderRadius: 4
    }
  };

  // =========================
  // Ventas por tienda
  // =========================
  ventasPorTiendaSeries: ApexAxisChartSeries = [];
  ventasPorTiendaXAxis: ApexXAxis = { categories: [] };

  // =========================
  // Servicios por tienda
  // (si usas el mismo endpoint,
  //  luego puedes separar)
  // =========================
  serviciosPorTiendaSeries: ApexAxisChartSeries = [];
  serviciosPorTiendaXAxis: ApexXAxis = { categories: [] };

  // =========================
  // Ventas acumuladas
  // =========================
  ventasAcumuladasSeries: ApexAxisChartSeries = [];
  ventasAcumuladasXAxis: ApexXAxis = { categories: [] };

  // =========================
  // Desviación por tienda
  // =========================
  desviacionSeries: ApexAxisChartSeries = [];
  desviacionXAxis: ApexXAxis = { categories: [] };

  barColors: string[] = [
    '#008FFB',
    '#00E396',
    '#FEB019',
    '#FF4560',
    '#775DD0',
    '#3F51B5',
    '#546E7A'
  ];

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.loadDashboard(this.fecha);
  }

  // =========================
  // LOAD ALL
  // =========================
  loadDashboard(fecha?: string): void {
    this.loadKpis(fecha);
    this.loadVentasPorTienda(fecha);
    this.loadVentasAcumuladas(fecha);
    this.loadDesviacionPorTienda(fecha);
    this.loadProductividadPersonalMasiva(fecha);
  }

  // =========================
  // KPIs
  // =========================
  loadKpis(fecha?: string): void {
    this.dashboardService.getKpis(this.fecha)
      .subscribe(res => {
        this.kpis = res;
        this.chartReady = true;
      });
  }

  // =========================
  // Ventas por tienda
  // =========================
  loadVentasPorTienda(fecha?: string): void {
    this.dashboardService.ventasPorTienda(this.fecha)
      .subscribe((data: any) => {

        this.ventasPorTiendaSeries = [{
          name: 'Ventas',
          data: data.map((x: any) => x.total)
        }];

        this.ventasPorTiendaXAxis = {
          categories: data.map((x: any) => x.tienda)
        };

        // Si quieres reutilizar para servicios (placeholder)
        this.serviciosPorTiendaSeries = [{
          name: 'Servicios',
          data: data.map((x: any) => Math.round(x.total / 50)) // estimado
        }];

        this.serviciosPorTiendaXAxis = {
          categories: data.map((x: any) => x.tienda)
        };
        this.chartReady2 = true;
      });
  }

  cambiarPeriodo() {

  const hoy = new Date();

  const year = hoy.getFullYear();
  const diaActual = hoy.getDate();

  const ultimoDiaMes = new Date(
    year,
    this.mesSeleccionado + 1,
    0
  ).getDate();

  const diaFinal = Math.min(diaActual, ultimoDiaMes);

  const nuevaFecha = new Date(
    year,
    this.mesSeleccionado,
    diaFinal
  );

  const fechaApi = nuevaFecha.toISOString().substring(0, 10);

  console.log('Fecha seleccionada:', fechaApi);

  // 🔹 guardar fecha seleccionada
  this.fecha = fechaApi;

  // 🔹 recargar dashboard completo
  this.loadDashboard(fechaApi);
}

  // =========================
  // Ventas acumuladas
  // =========================
  loadVentasAcumuladas(fecha?: string): void {
    this.dashboardService.ventasAcumuladas(this.fecha)
      .subscribe((data: any) => {

        this.ventasAcumuladasSeries = [
          {
            name: 'Mes Actual',
            data: data.map((x: any) => x.mesActual)
          },
          {
            name: 'Mes Anterior',
            data: data.map((x: any) => x.mesAnterior)
          }
        ];

        this.ventasAcumuladasXAxis = {
          categories: data.map((x: any) => `Día ${x.dia}`)
        };
        this.chartReady3 = true;
      });
  }

  // =========================
  // Desviación por tienda
  // =========================
  loadDesviacionPorTienda(fecha?: string): void {
    this.dashboardService.desviacionPorTienda(this.fecha)
      .subscribe((data: any) => {

        this.desviacionSeries = [{
          name: 'Desviación S/',
          data: data.map((x: any) => x.diferencia)
        }];

        this.desviacionXAxis = {
          categories: data.map((x: any) => x.tienda)
        };
        this.chartReady4 = true;
      });
  }

  loadProductividadPersonalMasiva(fecha?: string){
    this.dashboardService.getProductividadPersonalMasivo(this.fecha)
      .subscribe((data: any) => {
        this.topEstilistas = data.map((x: any) => ({
          estilista: x.empleado,
          importe: x.importe,
          cantidad: x.cantidad,
          establecimiento: x.establecimiento
        }));
      });
  }
}
