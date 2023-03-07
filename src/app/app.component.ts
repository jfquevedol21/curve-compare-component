import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import Chart from 'chart.js/auto';
import { environment } from 'src/environments/environment';
import { Curve } from './models/models';
import { CurveService } from './services/curve.service';

const plazo = 11500;
const b0= 12.19;
const b1 = 1.52;
const b2 = 4.33;
const t = 5.91;
// const fs = require('fs');

export class Curve_ {
  date!: Date;
  name!: string;
  constructor(name: string, date:Date){
    this.date=date;
    this.name=name;
  }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  
  title = 'curve-compare';
  pickedDate !: NgbDateStruct;
  pickedCurve !: string;
  public chart: any;
  curveOptions = environment.curves;
  curveList : Curve_[] = [];
  curveInfo : Curve[] = [];
  first=0;

  constructor(private curveService: CurveService){ }


  pickCurve(curve: string){
    this.pickedCurve=curve;
  }

  addCurve(){
    if(this.pickedDate.day<10){
      this.curveList.push(new Curve_(this.pickedCurve, new Date(`${this.pickedDate.year}-${this.pickedDate.month}-0${this.pickedDate.day}`)));
    }else{
      this.curveList.push(new Curve_(this.pickedCurve, new Date(`${this.pickedDate.year}-${this.pickedDate.month}-${this.pickedDate.day}`)));
    }
    this.curveService.getCurve(this.pickedCurve).subscribe((response:Curve)=>{
      this.dias = this.arrayRange(1, response.days, 30);


      for(let dia of this.dias){
        let año = dia/365
        this.first==0?this.años.push(this.round(año,1)):null;
        let valor = response.beta_0 + (response.beta_1+response.beta_2)*((1-Math.exp(-1*(año/response.tau)))/(año/response.tau)) - response.beta_2*Math.exp(-1*(año/response.tau))
        this.curva.push(valor);
      }
      this.first=this.first+1;
      this.chart.config._config.data.datasets.push({
        label: "Curva 3",
        data: this.curva,
        backgroundColor: 'gray',
        borderWidth: 1,
        borderColor: 'gray',
      });
      this.chart.update();
      this.curva=[];
      console.log(response)
    });

    

    // this.chart.config._config.data.datasets.push({
    //   label: "Curva 3",
    //   data: this.curva2,
    //   backgroundColor: 'gray',
    //   borderWidth: 1,
    //   borderColor: 'gray',
    // });
    // this.chart.update();

    console.log(JSON.stringify(this.curveList))
  }

  removeCurve(index:number){
    this.curveList.splice(index,1);
  }

  arrayRange = (start:number, stop:number, step:number) =>
    Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
    );
  
  dias : number[]=[];
  curva : number[] = [];
  curva2: number [] = [];
  
  años : number[] = [];

  fillCurve(days:number){
    this.dias = this.arrayRange(1, days, 30);
    for(let dia of this.dias){
      let año = dia/365
     
      this.años.push(this.round(año,1))
      let valor = b0 + (b1+b2)*((1-Math.exp(-1*(año/t)))/(año/t)) - b2*Math.exp(-1*(año/t))
      this.curva.push(valor);
    }

  }

  round(value:number, precision:number) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  createChart(){
  
    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart
      data: {// values on X-Axis
         labels: this.años, 
	       datasets: [
          // {
          //   label: "Curva 1",
          //   data: this.curva,
          //   backgroundColor: 'blue',
          //   borderWidth: 1,
          //   borderColor: 'blue',
          // }
        ]
      },
      options: {
        aspectRatio:2.0,
        scales:{
          y:{
            suggestedMin: 10,    // minimum will be 0, unless there is a lower value.
            suggestedMax: 15
          }
        },
        elements: {
          point:{
              radius: 0
          }
      }
      }
      
    });
    
    console.log(this.chart.config._config.data.datasets)
  }


  // exportJson(){
  //   const jsonContent = JSON.stringify(this.curva);
  //   fs.writeFile("./data.json", jsonContent, 'utf8', function (err:any) {
  //     if (err) {
  //         return console.log(err);
  //     }
  
  //     console.log("The file was saved!");
  // }); 
  // }

  ngOnInit(): void {
    //this.fillCurve()
    this.createChart()
    // this.exportJson()
    //console.log(this.curva)
  }

}
