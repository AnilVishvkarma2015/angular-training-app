import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { EmployeeService } from 'src/app/services/employee.service';
import { IEmployee } from 'src/app/models/employee.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent {
  displayedColumns = ['empCode', 'empFirstName', 'empLastName', 'empHrRight', 'empTimesheetRight', 'actions'];
  dataSource: MatTableDataSource<IEmployee>;
  Employees: IEmployee[] = [];
  isLoading = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private employeeService: EmployeeService, private router: Router) { }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  ngAfterViewInit() {
    this.loadEmployees();
  }

  private loadEmployees() {
    this.employeeService.getEmployees()
      .subscribe(employees => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(employees);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }, err => {
        throw err;
      });
  }

  addEmployee() {
    this.router.navigate(['addemployee']);
  }

  updateEmployee(employee: IEmployee) {
    localStorage.removeItem('editEmpId');
    localStorage.setItem('editEmpId', employee.id.toString());
    this.router.navigate(['addemployee']);
  }

  releaseEmployee(employee: IEmployee) {
    this.employeeService.releaseEmployee(employee);
  }

  showImage() {

  }
}
