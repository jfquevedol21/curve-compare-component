import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

const plazo = 11500;
const b0= 12.19;
const b1 = 1.52;
const b2 = 4.33;
const t = 5.91;
// const fs = require('fs');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  
  title = 'curve-compare';
  public chart: any;

  arrayRange = (start:number, stop:number, step:number) =>
    Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
    );
  
  dias = this.arrayRange(1, plazo, 30);
  curva : Number[] = []
  curva2: Number [] = []
  curva3: Number [] = []
  curva4: Number [] = []
  curva5: Number [] = []
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
      let valor3 = valor +1.0
      let valor4 = valor +1.5
      let valor5 = valor +2.0
      this.curva2.push(valor2);
      this.curva3.push(valor3);
      this.curva4.push(valor4);
      this.curva5.push(valor5);
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
          },
          {
            label: "Curva 3",
            data: this.curva3,
            backgroundColor: 'green',
            borderWidth: 1,
            borderColor: 'green',
          },
          {
            label: "Curva 4",
            data: this.curva4,
            backgroundColor: 'gray',
            borderWidth: 1,
            borderColor: 'gray',
          },
          {
            label: "Curva 5",
            data: this.curva5,
            backgroundColor: 'yellow',
            borderWidth: 1,
            borderColor: 'yellow',
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
