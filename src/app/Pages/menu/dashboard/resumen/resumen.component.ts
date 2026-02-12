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

  constructor(private dashboardService: DashboardService) { }
  ngOnInit(): void {
    this.cargarVentasDelMes();
    this.cargarServiciosMes();
    this.cargarTopServicios();
    this.cargarTopServiciosCantidad();
    this.cargarComparativo();
    this.cargarComparativosCircles();
    this.cargarProductividad();
    this.cargarContribucion();

  }

  cargarVentasDelMes() {

    const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset()); // Ajuste local
  const fechaHoy = hoy.toISOString().substring(0, 10);


    this.dashboardService.getVentasMensuales(fechaHoy)
      .subscribe(res => {
        const hoy = new Date().getDate();

        this.chartData = {
          labels: res.dias.slice(0, fechaHoy),
          datasets: [
            {
              data: res.montosPorDia.slice(0, fechaHoy),
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

  cargarServiciosMes() {

    // const hoy = new Date();
    // hoy.setDate(hoy.getDate() - 1);
    // const fecha = hoy.toISOString().substring(0, 10);

    const hoy = new Date().toISOString().substring(0, 10); // YYYY-MM-DD

    this.dashboardService.getServiciosMensuales(hoy)
      .subscribe(res => {
        const hoy = new Date().getDate();
        const diaHoy = hoy;
        this.chartServiciosData = {
          labels: res.dias.slice(0, diaHoy),
          datasets: [
            {
              data: res.serviciosPorDia.slice(0, diaHoy),
              label: 'Servicios por día',
              backgroundColor: this.getRepeatedColors(this.pastelColors, diaHoy),
              borderColor: this.getRepeatedColors(this.pastelBorder, diaHoy),
              borderWidth: 1,
              borderRadius: 5
            }
          ]
        };
        this.totalHoyServicios = res.totalDia;
        this.totalMesServicios = res.totalMes;
      });
  }

  cargarTopServicios() {

    const hoy = new Date().toISOString().substring(0, 10);

    // const hoy = new Date();
    // hoy.setDate(hoy.getDate() - 1);
    // const fecha = hoy.toISOString().substring(0, 10);

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

  cargarTopServiciosCantidad() {

    // const hoy = new Date();
    // hoy.setDate(hoy.getDate() - 1);
    // const fecha = hoy.toISOString().substring(0, 10);

    const hoy = new Date().toISOString().substring(0, 10); // YYYY-MM-DD

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

  cargarComparativo() {

    const hoy = new Date().toISOString().substring(0, 10);

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

  cargarComparativosCircles(): void {
    // const hoy = new Date();
    // // si quieres mandar ayer:
    // hoy.setDate(hoy.getDate() - 1);

    // const fecha = hoy.toISOString().substring(0, 10);
    const hoy = new Date().toISOString().substring(0, 10); // YYYY-MM-DD

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

  cargarProductividad() {
    const hoy = new Date().toISOString().substring(0, 10);

    this.dashboardService.getProductividadPersonal(hoy)
      .subscribe(res => {
        this.productividad = res;
      });
  }

  cargarContribucion() {
     const hoy = new Date();
    // si quieres mandar ayer:
    hoy.setDate(hoy.getDate());

    const fecha = hoy.toISOString().substring(0, 10);

    this.dashboardService.contribucionEstilistaDia(fecha).subscribe(res => {
      this.totalDia = res.reduce((s, x) => s + x.importe, 0);

      this.donutDiaData = {
        // labels: res.map(x => x.estilista),
        datasets: [{
          data: res.map(x => x.importe),
          backgroundColor: this.pastelColors
        }]
      };
    });

    this.dashboardService.contribucionEstilistaMes(fecha).subscribe(res => {
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
