import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Curve } from '../models/models';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CurveService {

  constructor(private http: HttpClient) { }

  public getCurve(curve?: string){
    return this.http.get<Curve>(environment.curveApi+curve);
  }

  
}
