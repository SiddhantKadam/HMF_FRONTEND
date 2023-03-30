import { EventEmitter, Injectable } from '@angular/core';
import { MainURL } from 'src/app/constants/configUrl';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpmethodsService {

  invokeFirstComponentFunction = new EventEmitter();
  subsVar: Subscription | any;

  changeMessage(e: any) {
    this.invokeFirstComponentFunction.emit(e);
  }

  baseUrl = MainURL.HostUrl;
  constructor(private http: HttpClient) {

  }

  postRequest(url: any, body: any) {
    return this.http.post(this.baseUrl + url, body)
  }

  getRequest(url: any) {
    return this.http.get(this.baseUrl + url)
  }

  putRequest(url: any, body: any) {
    return this.http.put(this.baseUrl + url, body)
  }

  deleteRequest(url: any) {
    return this.http.delete(this.baseUrl + url)
  }

  public uploadFile(url: string, formData: File) {

    const uploadFile: FormData = new FormData();

    uploadFile.append('uploadfile', formData);

    return this.http.post(this.baseUrl + url, uploadFile);
  }

}
