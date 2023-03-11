import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import Chart from 'chart.js/auto';
import { callback } from 'chart.js/dist/helpers/helpers.core';
import { environment } from 'src/environments/environment';
import { Curve } from './models/models';
import { CurveService } from './services/curve.service';

const plazo = 11500;
const b0 = 12.19;
const b1 = 1.52;
const b2 = 4.33;
const t = 5.91;
// const fs = require('fs');

export class Curve_ {
  date!: Date;
  name!: string;
  constructor(name: string, date: Date) {
    this.date = date;
    this.name = name;
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  title = 'curve-compare';
  pickedDate !: NgbDateStruct;
  pickedCurve !: string;
  public chart: any;
  curveOptions = environment.curves;
  colors = environment.colors;
  curveList: Curve_[] = [];
  curveInfo: Curve[] = [];
  first = 0;
  maxDays =0;

  constructor(private curveService: CurveService) { }


  pickCurve(curve: string) {
    this.pickedCurve = curve;
  }

  addCurveToList() {

    let tempCurve = new Curve_(this.pickedCurve, new Date(`${this.pickedDate.year}-${this.pickedDate.month}-${this.pickedDate.day}`));

    if (!this.curveList.some((curve: Curve_) => { return (curve.name == tempCurve.name && curve.date.getTime() == tempCurve.date.getTime()) })) {
      if (this.pickedDate.day < 10) {
        this.curveList.push(new Curve_(this.pickedCurve, new Date(`${this.pickedDate.year}-${this.pickedDate.month}-0${this.pickedDate.day}`)));
      } else {
        this.curveList.push(new Curve_(this.pickedCurve, new Date(`${this.pickedDate.year}-${this.pickedDate.month}-${this.pickedDate.day}`)));
      }
      this.addCurve();
    } else {
      alert("Curva ya existe");
    }
  }

  addCurve(_callback?: any) {
    let tempCurve = new Curve_(this.pickedCurve, new Date(`${this.pickedDate.year}-${this.pickedDate.month}-${this.pickedDate.day}`));
    if (!this.curveList.some((curve: Curve_) => { return (curve.name == tempCurve.name && curve.date.getTime() == tempCurve.date.getTime()) })) {
      if (this.pickedDate.day < 10) {
        this.curveList.push(new Curve_(this.pickedCurve, new Date(`${this.pickedDate.year}-${this.pickedDate.month}-0${this.pickedDate.day}`)));
      } else {
        this.curveList.push(new Curve_(this.pickedCurve, new Date(`${this.pickedDate.year}-${this.pickedDate.month}-${this.pickedDate.day}`)));
      }
      this.curveService.getCurve(this.pickedCurve).subscribe((response: Curve) => {
        
        this.dias = this.arrayRange(1, response.days, 30);
        let diasAño;

        if(this.first==0){
          diasAño = this.arrayRange(1, response.days, 30);
          for (let dia of this.dias) {
            let año = dia / 365
            this.años.push(this.round(año, 1));
          }
        }else{
          if(this.maxDays<response.days){
            this.maxDays=response.days;
            console.log(this.años.length)
            this.años=[];
            diasAño=this.arrayRange(1, this.maxDays, 30);
            
            for(let dia of diasAño){
              let año = dia / 365
              this.años.push(this.round(año, 1));
              //console.log("ENTRE ACA")
            }
            console.log(this.años.length)
            this.chart.config._config.data.labels=this.años;
            this.chart.update();
          }
        }
        
        console.log(this.maxDays);
        switch (this.pickedCurve) {
          case 'CECUVR':
          case 'CEC':
            
            

            for (let dia of this.dias) {
              let año = dia / 365
              //let valor = response.beta_0 + (response.beta_1+response.beta_2)*((1-Math.exp(-1*(año/response.tau)))/(año/response.tau)) - response.beta_2*Math.exp(-1*(año/response.tau))
              let valor = response.beta_0 + ((response.beta_1 + response.beta_2) * ((1 - Math.exp(-1 * año / response.tau)) / (año / response.tau))) - response.beta_2 * Math.exp(-1 * año / response.tau)
              valor = Math.exp(valor / 100) - 1;
              this.curva.push(valor * 100);
            }
            this.first = this.first + 1;
            this.chart.config._config.data.datasets.push({
              label: this.pickedCurve + "-" + `${{ ...this.pickedDate }.year}-${{ ...this.pickedDate }.month >= 10 ? { ...this.pickedDate }.month : "0" + { ...this.pickedDate }.month.toString()}-${{ ...this.pickedDate }.day}`,
              data: this.curva,
              backgroundColor:  this.colors[this.curveList.length-1],
              borderWidth: 1,
              borderColor:  this.colors[this.curveList.length-1],
            });
            this.chart.update();
            this.curva = [];
            break;

          case 'BAAA3':
          case 'BAAA12':
          case 'BAAA2':
            for (let dia of this.dias) {
              let año = dia / 365
              //this.first == 0 ? this.años.push(this.round(año, 1)) : null;
              //this.first == 0 ? this.años.push(this.round(año, 1)) : (this.maxDays<response.days&& dia>=response.days)?this.años.push(this.round(año,1)):null;
              //let valor = response.beta_0 + (response.beta_1+response.beta_2)*((1-Math.exp(-1*(año/response.tau)))/(año/response.tau)) - response.beta_2*Math.exp(-1*(año/response.tau))
              let valor = response.beta_0 + ((response.beta_1 + response.beta_2) * ((1 - Math.exp(-1 * año / response.tau)) / (año / response.tau))) - response.beta_2 * Math.exp(-1 * año / response.tau)
              //valor = Math.exp(valor/100)-1;
              let valor_corp = response.beta_0_r! + ((response.beta_1_r! + response.beta_2_r!) * ((1 - Math.exp(-1 * año / response.tau_r!)) / (año / response.tau_r!))) - response.beta_2_r! * Math.exp(-1 * año / response.tau_r!)
              let valor_sum = (valor / 100) + (valor_corp / 100)
              valor_sum = Math.exp(valor_sum) - 1
              this.curva.push(valor_sum * 100);
            }
            this.first = this.first + 1;
            let color = ""
            switch (this.pickedCurve) {
              case 'BAAA12':
                color = 'red';
                break;
              case 'BAAA2':
                color = 'purple';
                break;
              case 'BAAA3':
                color = 'green';
                break;
              default:
                null;
            }
            this.chart.config._config.data.datasets.push({
              label: this.pickedCurve + "-" + `${this.pickedDate.year}-${this.pickedDate.month >= 10 ? this.pickedDate.month : "0" + this.pickedDate.month.toString()}-${this.pickedDate.day}`,
              data: this.curva,
              backgroundColor:  this.colors[this.curveList.length-1],
              borderWidth: 1,
              borderColor:  this.colors[this.curveList.length-1],
            });
            this.chart.update();
            this.curva = [];
            break;
          default:
            null
        }
        if (_callback != null) {
          _callback();
        }
      });
    } else {
      if (_callback != null) {
        _callback();
      }
      alert("Curva ya existe")
    }
  }

  addPastCurve(tiempo: number) {
    var pastDate = { ... this.pickedDate };
    switch (tiempo) {
      case 1:
        if (this.pickedDate.month == 1) {
          --this.pickedDate.year;
          this.pickedDate.month = 12;
        } else {
          --this.pickedDate.month;
        }
        break;
      case 3:
        if (this.pickedDate.month <= 3) {
          --this.pickedDate.year;
          this.pickedDate.month = 12 + this.pickedDate.month - 3;
        } else {
          this.pickedDate.month = this.pickedDate.month - 3;
        }
        break;
      case 6:
        if (this.pickedDate.month <= 6) {
          --this.pickedDate.year;
          this.pickedDate.month = 12 + this.pickedDate.month - 6;
        } else {
          this.pickedDate.month = this.pickedDate.month - 6;
        }
        break;
      case 12:
        --this.pickedDate.year;
    }
 
    this.addCurve(() => {
      this.pickedDate = { ...pastDate }
    });
    
  }



  removeCurve(index: number) {
    this.curveList.splice(index, 1);
    this.chart.config._config.data.datasets.splice(index, 1);
    this.chart.update();
  }

  arrayRange = (start: number, stop: number, step: number) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (value, index) => start + index * step
    );

  dias: number[] = [];
  curva: number[] = [];
  curva2: number[] = [];

  años: number[] = [];

  round(value: number, precision: number) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  createChart() {
    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: this.años,
        datasets: []
      },
      options: {
        maintainAspectRatio: false,
        //aspectRatio: 2.0,
        scales: {
          y: {
            suggestedMin: 10,
            suggestedMax: 15
          }
        },
        elements: {
          point: {
            radius: 0
          }
        }
      }
    });

  }

  ngOnInit(): void {
    this.createChart()
  }

}
