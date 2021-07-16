import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

import { NgxSpinnerService } from 'ngx-spinner';
import { DailyproductionService } from '../shared/dailyproduction/dailyproduction.service';
import { DailyReportDisplayChrome } from '../shared/dailyproduction/dailyreportdisplaychrome.model';
import { Top5Rejection } from '../shared/dailyproduction/top5rejection.model';
import { TopDefectsummary } from '../shared/dailyproduction/TopDefectssummary.model';
import { LoginService } from '../shared/login/login.service';
import { User } from '../shared/login/User.model';
import { Plant } from '../shared/plant/plant.model';
import { PlantService } from '../shared/plant/plant.service';

@Component({
  selector: 'app-defect-dashboard',
  templateUrl: './defect-dashboard.component.html',
  styleUrls: ['./defect-dashboard.component.css']
})
export class DefectDashboardComponent implements OnInit {

  title = 'Chart';
  public myChart: Chart;
  canvas: any;
  ctx: any;

  public myChartcrm: Chart;
  canvascrm: any;
  ctxcrm: any;

  public myChartdef: Chart;
  canvasdef: any;
  ctxdef: any;

  public selectedchart: Top5Rejection[] = [];
  public selectedcharttot: Top5Rejection[] = [];
  public selectedchrome: DailyReportDisplayChrome[] = [];
  public selecteddefectsummary: TopDefectsummary[] = [];
  
  public itemlist: string[] = [];
  public inspectionvalue: number[] = [];
  public rejectvalue: number[] = [];
  public rejectper: number[] = [];


  public defectlist: string[] = [];
  public rejectvaluedefect: number[] = [];

  public daylistch: string[] = [];
  public inspectionvaluech: number[] = [];
  public inspectiontotalch: number;
  public Okvaluech: number[] = [];
  public rejectvaluech: number[] = [];
  public Rejectperch: number[] = [];


  public Month: string;
  public Week: string;
  public Day: string;

  public monthname: string;
  public typename: string;

  public loading = false;
  public monthNames: any;
  public d: any;
  currentUser: User;

  plantlistc: Plant[];
  pstname: string;

  year : number;

  constructor(public service: DailyproductionService, 
    public plantservice: PlantService, 
    public lservice: LoginService,
    private spinner: NgxSpinnerService) {
    this.lservice.currentUser.subscribe(x => (this.currentUser = x));
  }

  ngOnInit() {
    this.plantservice.getPlantData(this.currentUser.id);
    this.service.plantcode = '1040';
    this.service.plantshortname = 'GDPL Chennai';
    
    this.loading = true;

    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 2500);

    this.itemlist = [];
    this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
      'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    this.d = new Date();
    this.monthname = this.monthNames[this.d.getMonth()];
    this.typename = 'CHROME';
    this.year = JSON.parse(localStorage.getItem('selectedYear'));
    this.loadchart1();
    this.loadchartcrm();
    this.loadchartdefect();
  }

  getselectedtype(ev) {
    this.Month = 'a';
    this.typename = ev;
  }

  refreshChart(){
    this.year = JSON.parse(localStorage.getItem('selectedYear'));
    // console.log("year",this.year,"month",this.monthname);
      if (this.myChart) this.myChart.destroy();
      if (this.myChartdef) this.myChartdef.destroy();
    this.ctx.clearRect(0 , 0, this.canvas.weight, this.canvas.height);
    this.loadchart1();
    this.loadchartcrm();
    this.loadchartdefect();
  }

  getPlant(ev) {
    this.Month = 'a';
    this.service.plantcode = ev;
    this.plantservice
      .sgetPlantData(this.currentUser.id)
      .toPromise()
      .then(res => {
        this.plantlistc = res as Plant[];
        this.plantlistc.forEach(splant => {
          if (splant.plantcode == ev) {
            this.pstname = splant.plantShortName;
            this.service.plantshortname=this.pstname;
          }
        });
      });
    this.selectedPlant();
  }
  
  getselectedmonth(m) {
    this.Month = 'a';
    this.monthname=m;
    this.year = JSON.parse(localStorage.getItem('selectedYear'));
    // console.log("year",this.year,"month",this.monthname);
  }
  
  monthclick() {
    this.Month = 'M';
    this.year=this.d.getFullYear();
    if (this.myChart) this.myChart.destroy();
    if (this.myChartdef) this.myChartdef.destroy();
    this.ctx.clearRect(0 , 0, this.canvas.weight, this.canvas.height);
    this.loadchart1();
    this.loadchartcrm();
    this.loadchartdefect();
  }
  weekclick() {
    this.Month = 'W';
    this.year=this.d.getFullYear();
    if (this.myChart) this.myChart.destroy();
    if (this.myChartdef) this.myChartdef.destroy();
    this.ctx.clearRect(0 , 0, this.canvas.weight, this.canvas.height);
    this.loadchart1();
    this.loadchartcrm();
    this.loadchartdefect();
  }
  dayclick() {
    this.Month = 'D';
    this.year=this.d.getFullYear();
    if (this.myChart) this.myChart.destroy();
    if (this.myChartdef) this.myChartdef.destroy();
    this.ctx.clearRect(0 , 0, this.canvas.weight, this.canvas.height);
    this.loadchart1();
    this.loadchartcrm();
    this.loadchartdefect();
  }
  loadchart() {
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    this.myChart = new Chart(this.ctx, {
    type: 'bar',
    data: {
      labels: this.itemlist,
      datasets: [
        {
          label: 'Produce Value',
          type: 'bar',
          backgroundColor: '#73b4fa',
          data: this.inspectionvalue
        },
        {
          label: 'Rejection Value',
          type: 'bar',
          backgroundColor: '#11f2a3',
          data: this.rejectvalue
        },
        {
          label: 'Reject %',
          type: 'line',
          data: this.rejectper
        }
      ]
    },
    options: {
      scaleBeginAtZero: true,
      scaleShowGridLines: true,
      scaleGridLineColor: "rgba(0,0,0,0.05)",
      scaleGridLineWidth: 1,
      scaleShowHorizontalLines: true,
      scaleShowVerticalLines: true,
      barShowStroke: true,
      barStrokeWidth: 2,
      barValueSpacing: 5,
      barDatasetSpacing: 1,
      responsive: true,
      maintainAspectRatio: false,
      hover: {
          mode: 'label'
      },
      scales: {
          yAxes: [{
              scaleLabel: {
                  display: true,
                  labelString: 'In Lakhs'
              }
          }]
      },
      animation: {
        duration: 1,
        onComplete: function () {
          const chartInstance = this.chart;
          this.ctx = chartInstance.ctx;
          this.font = Chart.helpers.fontString
          (Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
          this.textAlign = 'center';
          this.textBaseline = 'bottom';
          this.data.datasets.forEach(function(dataset, i) {
            if (dataset.type === 'line') {
              const meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function(bar, index) {
                const data = dataset.data[index];
                if (data !== '0.00') {
                  chartInstance.ctx.fillStyle = '#dc3545';
                  chartInstance.ctx.font = 'italic bold 8pt verdana';
                  chartInstance.ctx.fillText(data + ' %', bar._model.x, bar._model.y - 5);
                }
              }
            );
          }
        }
      );
    }
  }
}
 });
   }
   loadchart1() {
    this.itemlist = [];
    this.inspectionvalue = [];
    this.rejectvalue = [];
    this.rejectper = [];
    this.loading = true;
    if (this.Month === 'M')
    {
      this.Month = 'M';
      this.monthname = this.monthNames[this.d.getMonth()];
    }
    else if (this.Month === 'W') {
      this.Month = 'W';
      this.monthname = this.monthNames[this.d.getMonth()];
    }
    else if (this.Month === 'D') {
      this.Month = 'D';
      this.monthname = this.monthNames[this.d.getMonth()];
    }
    else {
      this.Month = 'a';
    }
    this.service.gettop5rejection(this.service.plantcode, this.Month, this.monthname,this.year)
    .toPromise()
    .then(res => {
      this.selectedchart = res as Top5Rejection[];
      for (const xx of this.selectedchart) {
       
          this.itemlist.push(xx.itemname);
          this.inspectionvalue.push(xx.producevalue);
          this.rejectvalue.push(xx.rejectvalue);
          this.rejectper.push(xx.rejectper);
      }
      this.loadchart();
      this.loading = false;
    });
  }

  setchartchrome() {
  Chart.defaults.global.legend.display = false;
  this.canvascrm = document.getElementById('myChartcrm');
  this.ctxcrm = this.canvascrm.getContext('2d');
  this.myChartcrm = new Chart(this.ctxcrm, {
  type: 'bar',
  data: {
    labels: this.daylistch,
    datasets: [
      {
        label: 'Total Inspection',
        type: 'bar',
        backgroundColor: '#73b4fa',
        data: this.inspectionvaluech
      },
      {
        label: 'Ok Value',
        type: 'bar',
        backgroundColor: '#11f2a3',
        data: this.Okvaluech
      },
      {
        label: 'Reject Value',
        type: 'bar',
        backgroundColor: '#fe909d',
        data: this.rejectvaluech
      },
      {
        label: 'Reject %',
        type: 'line',
      // backgroundColor: '#FFFFFF',
        data: this.Rejectperch
      }, 
     ]
  },
    options: {
      scaleBeginAtZero: true,
      scaleShowGridLines: true,
      // tslint:disable-next-line:quotemark
      scaleGridLineColor: "rgba(0,0,0,.05)",
      scaleGridLineWidth: 1,
      scaleShowHorizontalLines: true,
      scaleShowVerticalLines: true,
      barShowStroke: true,
      barStrokeWidth: 2,
      barValueSpacing: 5,
      barDatasetSpacing: 1,
      responsive: true,
      tooltips: {
        mode: 'index',
        intersect: true
      },
      annotation: {
        annotations: [{
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 15,
          endValue: 15,
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 4,
          label: {
            enabled: true,
            content: 'Trendline 15%',
            yAdjust: -16,
          }
        }]
      },
      maintainAspectRatio: false,
      hover: {
          mode: 'label'
      },
      scales: {
          yAxes: [{
              scaleLabel: {
                  display: true,
                  labelString: 'In Lakhs'
              }
          }]
      },
    }
  });
  }
  
  loadchartcrm() {
    this.daylistch = [];
    this.inspectionvaluech = [];
    this.Okvaluech = [];
    this.rejectvaluech = [];
    this.Rejectperch = [];
    this.loading = true;
    if (this.Month === 'M')
    {
      this.Month = 'M';
      this.monthname = this.monthNames[this.d.getMonth()];
    }
    else if (this.Month === 'W') {
      this.Month = 'W';
      this.monthname = this.monthNames[this.d.getMonth()];
    }
    else if (this.Month === 'D') {
      this.Month = 'D';
      this.monthname = this.monthNames[this.d.getMonth()];
    }
    else {
      this.Month = 'a';
    }
    if (this.typename === 'CHROME')
    {
      if (this.myChartcrm) this.myChartcrm.destroy();
      this.daylistch = [];
      this.inspectionvaluech = [];
      this.Okvaluech = [];
      this.rejectvaluech = [];
      this.Rejectperch = [];
      this.service.getprochartchrome(this.service.plantcode, this.Month, this.monthname,this.year)
      .toPromise()
      .then(res => {
        this.selectedchrome = res as DailyReportDisplayChrome[];
        for (const xx of this.selectedchrome) {
            this.daylistch.push(xx.inspectiondate.replace('T00:00:00', ''));
            this.inspectionvaluech.push(xx.inspectionvalue);
            this.Okvaluech.push(xx.okvalue);
            this.rejectvaluech.push(xx.rejectvalue);
            this.Rejectperch.push(xx.rejper);
        }
        this.setchartchrome();
        this.loading = false;
      });
    }
    else
    {
      if (this.myChartcrm) this.myChartcrm.destroy();
      this.daylistch = [];
      this.inspectionvaluech = [];
      this.Okvaluech = [];
      this.rejectvaluech = [];
      this.Rejectperch = [];
  
      this.service.getprochartsatin(this.service.plantcode, this.Month, this.monthname,this.year)
      .toPromise()
      .then(res => {
        this.selectedchrome = res as DailyReportDisplayChrome[];
        for (const xx of this.selectedchrome) {
            this.daylistch.push(xx.inspectiondate.replace('T00:00:00', ''));
            this.inspectionvaluech.push(xx.inspectionvalue);
            this.Okvaluech.push(xx.okvalue);
            this.rejectvaluech.push(xx.rejectvalue);
            this.Rejectperch.push(xx.rejper);
        }
        this.setchartchrome();
        this.loading = false;
      });
    }
   
  }

  setchartdefect() {
    Chart.defaults.global.legend.display = false;
    this.canvasdef = document.getElementById('myChartdefect');
    this.ctxdef = this.canvasdef.getContext('2d');
    this.myChartdef = new Chart(this.ctxdef, {
      type: 'bar',
      data: {
        labels: this.defectlist,
        datasets: [
          {
            label: 'Total Rejection',
            type: 'bar',
            backgroundColor: '#fe909d',
            data: this.rejectvaluedefect
          }
        ]
      },
      options: {
        scaleBeginAtZero: true,
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        scaleShowHorizontalLines: true,
        scaleShowVerticalLines: true,
        barShowStroke: true,
        barStrokeWidth: 2,
        barValueSpacing: 5,
        barDatasetSpacing: 1,
        responsive: true,
        tooltips: {
          mode: 'index',
          intersect: true
        },
        maintainAspectRatio: false,
        hover: {
            mode: 'label'
        },
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'In Lakhs'
                }
            }]
        },
      }
    });
   }

   loadchartdefect() {
    this.defectlist = [];
    this.rejectvaluedefect = [];
    this.loading = true;
    if (this.Month === 'M')
    {
      this.Month = 'M';
      this.monthname = this.monthNames[this.d.getMonth()];
    }
    else if (this.Month === 'W') {
      this.Month = 'W';
      this.monthname = this.monthNames[this.d.getMonth()];
    }
    else if (this.Month === 'D') {
      this.Month = 'D';
      this.monthname = this.monthNames[this.d.getMonth()];
    }
    else {
      this.Month = 'a';
    }
    if (this.typename === 'CHROME')
    {
      if (this.myChartdef) this.myChartdef.destroy();
      this.defectlist = [];
      this.rejectvaluedefect = [];
      this.service.getprochartdefect(this.service.plantcode, 'ZCRM', this.monthname,this.year)
      .toPromise()
      .then(res => {
        this.selecteddefectsummary = res as TopDefectsummary[];
        for (const xx of this.selecteddefectsummary) {
            this.defectlist.push(xx.defect);
            this.rejectvaluedefect.push(xx.rejvalue);
        }
        this.setchartdefect();
        this.loading = false;
      });
    }
    else
    {
      if (this.myChartdef) this.myChartdef.destroy();
      this.defectlist = [];
      this.rejectvaluedefect = [];
      this.service.getprochartdefect(this.service.plantcode, 'ZSAT', this.monthname,this.year)
      .toPromise()
      .then(res => {
        this.selecteddefectsummary = res as TopDefectsummary[];
        for (const xx of this.selecteddefectsummary) {
            this.defectlist.push(xx.defect);
            this.rejectvaluedefect.push(xx.rejvalue);
        }
        this.setchartdefect();
        this.loading = false;
      });
    }
  }

  selectedPlant() {
    const me = this;
    if (this.plantservice && this.plantservice.plantlist && me.service.plantcode) {
        this.plantservice.plantlist.forEach(function (element, i) {
        // console.log(me.service.plantshortname);
        if (element.plantcode == me.service.plantcode) {
          me.service.plantshortname = element.plantShortName;
          // console.log(me.service.plantshortname);
        }
      });
    }
  }
}
