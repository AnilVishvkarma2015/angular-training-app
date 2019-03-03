import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import { IEmployee } from '../models/employee.model';
import { Observable, throwError } from 'rxjs';
import { ToastService } from './toast.service';
import { AppConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
  apiBaseURL = AppConfig.settings.apiServer.baseURL;
  httpOptions: Object;

  constructor(private http: HttpClient, private toastService: ToastService) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
  }

  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {

      errorMessage = `An error occurred: ${err.error.message}`;
    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    return throwError(errorMessage);
  }

  addEmployee(newEmployee: IEmployee) {
    return this.http.post(this.apiBaseURL + 'employees/create', newEmployee, this.httpOptions)
      .subscribe(res => {
        this.toastService.openSnackBar('Employee Added Successfully', '', 'success-snackbar');
        return res;
      }, error => {
        this.toastService.openSnackBar('Error occurred to add employee', '', 'error-snackbar');
        throw error;
      })
  }

  getEmployees(): Observable<IEmployee[]> {
    return this.http.get<IEmployee[]>(this.apiBaseURL + 'employees/')
      .pipe(tap(res => { return res; }),
        catchError(this.handleError)
      );
  }

  getEmployeeById(id): Observable<IEmployee> {
    return this.http.get<IEmployee>(this.apiBaseURL + 'employees/' + id)
      .pipe(tap(res => { return res; }),
        catchError(this.handleError)
      );
  }

  updateEmployee(updatedEmployee: IEmployee) {
    return this.http.put(this.apiBaseURL + 'employees/' + updatedEmployee.id, updatedEmployee)
      .subscribe(res => {
        this.toastService.openSnackBar('Employee Updated Successfully', '', 'success-snackbar');
        return res;
      }, error => {
        this.toastService.openSnackBar('Error occurred to update employee', '', 'error-snackbar');
        throw error;
      })
  }

  releaseEmployee(releasedEmployee: IEmployee) {
    return this.http.delete(this.apiBaseURL + 'employees/' + releasedEmployee.id)
      .subscribe(res => {
        this.toastService.openSnackBar('Employee Released Successfully', '', 'success-snackbar');
        return res;
      }, error => {
        this.toastService.openSnackBar('Error occurred to release employee', '', 'error-snackbar');
        throw error;
      });
  }
}
