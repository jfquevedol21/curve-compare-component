import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import Chart from 'chart.js/auto';
import { environment } from 'src/environments/environment';

const plazo = 11500;
const b0= 12.19;
const b1 = 1.52;
const b2 = 4.33;
const t = 5.91;
// const fs = require('fs');

export class Curve {
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
  curveList : Curve[] = [];


  pickCurve(curve: string){
    this.pickedCurve=curve;
  }

  addCurve(){
    if(this.pickedDate.day<10){
      this.curveList.push(new Curve(this.pickedCurve, new Date(`${this.pickedDate.year}-${this.pickedDate.month}-0${this.pickedDate.day}`)));
    }else{
      this.curveList.push(new Curve(this.pickedCurve, new Date(`${this.pickedDate.year}-${this.pickedDate.month}-${this.pickedDate.day}`)));
    }
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
  
  dias = this.arrayRange(1, plazo, 30);
  curva : Number[] = []
  curva2: Number [] = []
  
  años : Number[] = []
  fillCurve(){
    for(let dia of this.dias){
      let año = dia/365
      //this.años.push(Math.round(año))
      this.años.push(this.round(año,1))
      let valor = b0 + (b1+b2)*((1-Math.exp(-1*(año/t)))/(año/t)) - b2*Math.exp(-1*(año/t))
      this.curva.push(valor);
      //let valor2 = b0 + (b1+b2)*((1-Math.exp(-1*(año/t)))/(año/t)) - b2*Math.exp(-1*(año/t)) +1
      let valor2 = valor +0.5
      this.curva2.push(valor2)
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
          {
            label: "Curva 1",
            data: this.curva,
            backgroundColor: 'blue',
            borderWidth: 1,
            borderColor: 'blue',
          },
          {
            label: "Curva 2",
            data: this.curva2,
            backgroundColor: 'red',
            borderWidth: 1,
            borderColor: 'red',
          }
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
    this.fillCurve()
    this.createChart()
    // this.exportJson()
    console.log(this.curva)
  }

}
