import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  employeeForm: FormGroup;

  empformlabel: string = 'Add Employee';
  empformbtn: string = 'Save';
  btnvisibility: boolean = true;

  hrRights = ['Project Manager', 'Deliver Manager', 'LOB Manager', 'Business Delivery Owner', 'Director', 'General Manager'];
  tsRights = ['Mediater', 'Approver', 'Auditor']

  constructor(private formBuilder: FormBuilder, private router: Router, private employeeService: EmployeeService) {
  }

  ngOnInit() {
    this.employeeForm = this.formBuilder.group({
      id: [],
      empCode: ['', Validators.required],
      empFirstName: ['', Validators.required],
      empLastName: ['', Validators.required],
      empHrRight: ['', Validators.required],
      empTimesheetRight: ['', Validators.required]
    });

    let empID = localStorage.getItem('editEmpId');
    if (empID) {
      this.employeeService.getEmployeeById(empID).subscribe(data => {
        this.employeeForm.patchValue(data);
      })
      this.btnvisibility = false;
      this.empformlabel = 'Edit Employee';
      this.empformbtn = 'Update';
    }
  }

  isFieldInvalid(field: string) {
    return (
      (!this.employeeForm.get(field).valid && this.employeeForm.get(field).touched) ||
      (this.employeeForm.get(field).untouched)
    );
  }

  onSubmit() {
    return this.employeeService.addEmployee(this.employeeForm.value).add(() => {
      this.router.navigate(['employees']);
    })
  }

  onUpdate() {
    return this.employeeService.updateEmployee(this.employeeForm.value).add(() => {
      localStorage.removeItem('editEmpId');
      this.router.navigate(['employees']);
    })
  }
}
