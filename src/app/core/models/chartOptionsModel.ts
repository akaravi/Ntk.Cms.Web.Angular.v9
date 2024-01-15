import { ApexChart, ApexNonAxisChartSeries, ApexResponsive } from "ng-apexcharts";

export class ChartOptionsModel {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
}
