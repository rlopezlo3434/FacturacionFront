import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartType, ChartConfiguration } from 'chart.js';
import { DashboardService } from '../../../../../services/dashboard.service';

Chart.register(...registerables);


@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.scss'
})
export class ResumenComponent {

  chartType: ChartType = 'bar';

  chartData: ChartConfiguration['data'] = {
    labels: ['Enero', 'Febrero', 'Marzo'],
    datasets: [
      { data: [120, 200, 150], label: 'Ventas' }
    ]
  };

  chartServiciosData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [120, 200, 150],
        label: 'Servicios por día',
      }
    ]
  };

  chartTopDia: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Soles',
      }
    ]
  };

  chartTopDiaCantidad: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Soles',
      }
    ]
  };

  compDiario: any | null = null;
  compMensual: any | null = null;

  donutDiaData: any;
  donutMesData: any;
  totalDia = 0;
  totalMes = 0;
  donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const value = ctx.raw;
            const pct = ((value / total) * 100).toFixed(1);
            return `${ctx.label}: S/ ${value.toFixed(2)} (${pct}%)`;
          }
        }
      }
    }
  };


  circleOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = Number(ctx.raw ?? 0);
            return `${ctx.label}: S/ ${v.toFixed(2)}`;
          }
        }
      }
    }
  };

  circleDiarioData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Hoy', 'Ayer'],
    datasets: [{
      data: [0, 0],
      backgroundColor: [
        'rgba(54, 162, 235, 0.35)',
        'rgba(255, 99, 132, 0.35)'
      ],
      borderColor: [
        'rgb(54, 162, 235)',
        'rgb(255, 99, 132)'
      ],
      borderWidth: 1
    }]
  };

  circleMensualData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Mes actual', 'Mes anterior'],
    datasets: [{
      data: [0, 0],
      backgroundColor: [
        'rgba(75, 192, 192, 0.35)',
        'rgba(255, 159, 64, 0.35)'
      ],
      borderColor: [
        'rgb(75, 192, 192)',
        'rgb(255, 159, 64)'
      ],
      borderWidth: 1
    }]
  };


  chartOptions = {
    plugins: {
      legend: {
        display: false // ✅ elimina "Ventas"
      }
    },
    responsive: true,
    maintainAspectRatio: false,   // 👈 IMPORTANTE

  };

  chartTopMes: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Soles',
      }
    ]
  };

  chartComparativoData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Mes actual',
      },
      {
        data: [],
        label: 'Mes anterior',
      }
    ]
  };

  chartTopMesCantidad: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Soles',
      }
    ]
  };


  ventasMontoData = {
    labels: ['1/12', '2/12', '3/12', '4/12'],
    datasets: [
      {
        data: [300, 450, 320, 600],
        label: 'Montos',
        backgroundColor: '#3498db'
      }
    ]
  };

  ventasServiciosData = {
    labels: ['1/12', '2/12', '3/12', '4/12'],
    datasets: [
      {
        data: [20, 30, 18, 25],
        label: 'Servicios',
        backgroundColor: '#2ecc71'
      }
    ]
  };

  totalHoySoles = 0;
  totalMesSoles = 0;

  totalHoyServicios = 0;
  totalMesServicios = 0;

  pastelColors = [
    'rgba(255, 99, 132, 0.4)',
    'rgba(255, 159, 64, 0.4)',
    'rgba(255, 205, 86, 0.4)',
    'rgba(75, 192, 192, 0.4)',
    'rgba(54, 162, 235, 0.4)',
    'rgba(153, 102, 255, 0.4)',
    'rgba(201, 203, 207, 0.4)'
  ];

  pastelBorder = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)'
  ];

  productividad: any[] = [];
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

  mostrarTotalHoy = true;

  constructor(private dashboardService: DashboardService) { }
  ngOnInit(): void {
    this.cambiarPeriodo();
    // this.cargarVentasDelMes();
    // this.cargarServiciosMes();
    // this.cargarTopServicios();
    // this.cargarTopServiciosCantidad();
    // this.cargarComparativo();
    // this.cargarComparativosCircles();
    // this.cargarProductividad();
    // this.cargarContribucion();

  }

  cargarVentasDelMes(fecha?: string) {
    console.log('Cargando ventas del mes para fecha:', fecha);
    const fechaConsulta = fecha || this.obtenerFechaLocal(); // YYYY-MM-DD

    this.dashboardService.getVentasMensuales(fechaConsulta)
      .subscribe(res => {
        const fechaObj = new Date(fechaConsulta);
        const hoy = new Date();

        const esMesActual =
          fechaObj.getMonth() === hoy.getMonth() &&
          fechaObj.getFullYear() === hoy.getFullYear();

        this.mostrarTotalHoy = esMesActual;
        // si es mes actual solo hasta hoy, si no todo el mes
        const diasMostrar = esMesActual ? hoy.getDate() : res.dias.length;

        this.chartData = {
          labels: res.dias.slice(0, diasMostrar),
          datasets: [
            {
              data: res.montosPorDia.slice(0, diasMostrar),
              label: 'Monto diario',
              backgroundColor: this.getRepeatedColors(this.pastelColors, res.montosPorDia.length),
              borderColor: this.getRepeatedColors(this.pastelBorder, res.montosPorDia.length),
              borderWidth: 1,
              borderRadius: 5
            }
          ]
        };

        this.totalHoySoles = res.totalDia;
        this.totalMesSoles = res.totalMes;

      });
  }

  cargarServiciosMes(fecha?: string) {

    const fechaConsulta = fecha || this.obtenerFechaLocal(); // YYYY-MM-DD

    this.dashboardService.getServiciosMensuales(fechaConsulta)
      .subscribe(res => {
         const fechaObj = new Date(fechaConsulta);
        const hoy = new Date();

        const esMesActual =
          fechaObj.getMonth() === hoy.getMonth() &&
          fechaObj.getFullYear() === hoy.getFullYear();

        this.mostrarTotalHoy = esMesActual;
        // si es mes actual solo hasta hoy, si no todo el mes
        const diasMostrar = esMesActual ? hoy.getDate() : res.dias.length;
        this.chartServiciosData = {
          labels: res.dias.slice(0, diasMostrar),
          datasets: [
            {
              data: res.serviciosPorDia.slice(0, diasMostrar),
              label: 'Servicios por día',
              backgroundColor: this.getRepeatedColors(this.pastelColors, diasMostrar),
              borderColor: this.getRepeatedColors(this.pastelBorder, diasMostrar),
              borderWidth: 1,
              borderRadius: 5
            }
          ]
        };
        this.totalHoyServicios = res.totalDia;
        this.totalMesServicios = res.totalMes;
      });
  }

  cargarTopServicios(fecha?: string) {

    const hoy = fecha || this.obtenerFechaLocal();

    this.dashboardService.getTopServiciosDia(hoy)
      .subscribe(res => {
        this.chartTopDia = {
          labels: res.map((r: any) => r.servicio),
          datasets: [
            {
              data: res.map((r: any) => r.monto),
              label: 'Soles',
              backgroundColor: this.getRepeatedColors(this.pastelColors, res.length),
              borderColor: this.getRepeatedColors(this.pastelBorder, res.length),
              borderWidth: 1,
              borderRadius: 5
            }
          ]
        };
      });

    this.dashboardService.getTopServiciosMes(hoy)
      .subscribe(res => {
        this.chartTopMes = {
          labels: res.map((r: any) => r.servicio),
          datasets: [
            {
              data: res.map((r: any) => r.monto),
              label: 'Soles',
              backgroundColor: this.getRepeatedColors(this.pastelColors, res.length),
              borderColor: this.getRepeatedColors(this.pastelBorder, res.length),
              borderWidth: 1,
              borderRadius: 5
            }
          ]
        };
      });

  }

  cargarTopServiciosCantidad(fecha?: string) {

    const hoy = fecha || this.obtenerFechaLocal();

    this.dashboardService.getTopServiciosDiaCantidad(hoy)
      .subscribe(res => {
        this.chartTopDiaCantidad = {
          labels: res.map((r: any) => r.servicio),
          datasets: [
            {
              data: res.map((r: any) => r.monto),
              label: 'Cantidad',
              backgroundColor: this.getRepeatedColors(this.pastelColors, res.length),
              borderColor: this.getRepeatedColors(this.pastelBorder, res.length),
              borderWidth: 1,
              borderRadius: 5
            }
          ]
        };
      }
      );
    this.dashboardService.getTopServiciosMesCantidad(hoy)
      .subscribe(res => {
        this.chartTopMesCantidad = {
          labels: res.map((r: any) => r.servicio),
          datasets: [
            {
              data: res.map((r: any) => r.monto),
              label: 'Cantidad',
              backgroundColor: this.getRepeatedColors(this.pastelColors, res.length),
              borderColor: this.getRepeatedColors(this.pastelBorder, res.length),
              borderWidth: 1,
              borderRadius: 5
            }
          ]
        };
      }
      );
  }

  cargarComparativo(fecha?: string) {

    const hoy = fecha || this.obtenerFechaLocal();
    this.dashboardService.getComparativoMensual(hoy)
      .subscribe(res => {

        this.chartComparativoData = {
          labels: res.dias,
          datasets: [
            {
              data: res.mesActual,
              label: 'Mes actual',
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgb(54,162,235)',
              borderWidth: 1,
              borderRadius: 6
            },
            {
              data: res.mesAnterior,
              label: 'Mes anterior',
              backgroundColor: 'rgba(175, 169, 170, 0.6)',
              borderColor: 'rgba(163, 163, 163, 1)',
              borderWidth: 1,
              borderRadius: 6
            }
          ]
        };

      });
  }

  cargarComparativosCircles(fecha?: string): void {
    const hoy = fecha || this.obtenerFechaLocal();

    console.log('Fecha para comparativos:', hoy);
    this.dashboardService.comparativoDiario(hoy).subscribe((res: any) => {
      this.compDiario = res;

      // Reemplazar objeto completo para que chart refresque
      this.circleDiarioData = {
        labels: ['Hoy', 'Ayer'],
        datasets: [{
          data: [res.actual ?? 0, res.anterior ?? 0],
          backgroundColor: [
            'rgba(54, 162, 235, 0.35)',
            'rgba(255, 99, 132, 0.35)'
          ],
          borderColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 99, 132)'
          ],
          borderWidth: 1
        }]
      };
    });

    this.dashboardService.comparativoMensual(hoy).subscribe((res: any) => {
      this.compMensual = res;

      this.circleMensualData = {
        labels: ['Mes actual', 'Mes anterior'],
        datasets: [{
          data: [res.actual ?? 0, res.anterior ?? 0],
          backgroundColor: [
            'rgba(75, 192, 192, 0.35)',
            'rgba(255, 159, 64, 0.35)'
          ],
          borderColor: [
            'rgb(75, 192, 192)',
            'rgb(255, 159, 64)'
          ],
          borderWidth: 1
        }]
      };
    });
  }

  private obtenerFechaLocal(fecha?: Date): string {

    const f = fecha ?? new Date();

    const year = f.getFullYear();
    const month = String(f.getMonth() + 1).padStart(2, '0');
    const day = String(f.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
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

    const fechaApi = this.obtenerFechaLocal(nuevaFecha);

    // ✅ AQUÍ interactúan realmente
    this.cargarVentasDelMes(fechaApi);
    this.cargarServiciosMes(fechaApi);
    this.cargarTopServicios(fechaApi);
    this.cargarTopServiciosCantidad(fechaApi);
    this.cargarComparativo(fechaApi);
    this.cargarComparativosCircles(fechaApi);
    this.cargarProductividad(fechaApi);
    this.cargarContribucion(fechaApi);
  }

  cargarProductividad(fecha?: string) {
    // const hoy = new Date().toISOString().substring(0, 10);
    const hoy = fecha || this.obtenerFechaLocal();
    this.dashboardService.getProductividadPersonal(hoy)
      .subscribe(res => {
        this.productividad = res;
      });
  }

  cargarContribucion(fecha?: string) {

    const hoy = fecha || this.obtenerFechaLocal();


    this.dashboardService.contribucionEstilistaDia(hoy).subscribe(res => {
      this.totalDia = res.reduce((s, x) => s + x.importe, 0);

      this.donutDiaData = {
        // labels: res.map(x => x.estilista),
        datasets: [{
          data: res.map(x => x.importe),
          backgroundColor: this.pastelColors
        }]
      };
    });

    this.dashboardService.contribucionEstilistaMes(hoy).subscribe(res => {
      this.totalMes = res.reduce((s, x) => s + x.importe, 0);

      this.donutMesData = {
        labels: res.map(x => x.estilista),
        datasets: [{
          data: res.map(x => x.importe),
          backgroundColor: this.pastelColors
        }]
      };
    });
  }



  getRandomPastelColors(length: number): string[] {
    const result = [];

    for (let i = 0; i < length; i++) {
      const random = Math.floor(Math.random() * this.pastelColors.length);
      result.push(this.pastelColors[random]);
    }

    return result;
  }

  getRepeatedColors(source: string[], length: number): string[] {
    return Array.from({ length }, (_, i) => source[i % source.length]);
  }
}
