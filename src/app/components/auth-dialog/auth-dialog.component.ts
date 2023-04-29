import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ROLE } from 'src/app/shared/constants/role.constant';
import { AccountService } from 'src/app/shared/services/account/account.service';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.css'],
})
export class AuthDialogComponent implements OnInit {
  public authUserForm!: FormGroup;
  public registerUserForm!: FormGroup;
  public isRegistred = true;
  private registerData!: any;
  public checkPassword = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AuthDialogComponent>,
    private accountService: AccountService,
    private router: Router,
    private auth: Auth,
    private afs: Firestore
  ) {}

  ngOnInit(): void {
    this.initAuthUserForm();
    this.initRegisterUserForm();
  }

  initAuthUserForm(): void {
    this.authUserForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  initRegisterUserForm(): void {
    this.registerUserForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
      confirmedPassword: [null, Validators.required],
    });
  }

  changeRegistred(): void {
    this.isRegistred = !this.isRegistred;
  }

  loginUser(): void {
    const { email, password } = this.authUserForm.value;
    this.login(email, password)
      .then(() => {
        console.log('login done');
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async login(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    docData(doc(this.afs, 'users', credential.user.uid)).subscribe(
      (user) => {
        const currentUser = { ...user, uid: credential.user.uid };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.accountService.isUserLogin$.next(true);
        if (user && user.role === ROLE.USER) {
          this.router.navigate(['/cabinet']);
        } else if (user && user.role === ROLE.ADMIN) {
          this.router.navigate(['/admin']);
        }
      },
      (e) => {
        console.log('error', e);
      }
    );
  }

  registerUser(): void {
    const { email, password } = this.registerUserForm.value;
    this.registerData = this.registerUserForm.value;
    this.emailSignUp(email, password)
      .then(() => {
        this.isRegistred = !this.isRegistred;
        this.registerUserForm.reset();
      })
      .catch((e) => {
        console.error(e.message);
      });
  }

  async emailSignUp(email: string, password: string): Promise<any> {
    const credential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const user = {
      email: credential.user.email,
      firstName: this.registerUserForm.value.firstName,
      lastName: this.registerUserForm.value.lastName,
      phone: this.registerUserForm.value.phone,
      address: '',
      orders: [],
      role: 'USER',
    };
    setDoc(doc(this.afs, 'users', credential.user.uid), user);
  }

  checkConfirmedPassword(): void {
    this.checkPassword = this.password.value === this.confirmedPassword.value;
    if (this.password.value !== this.confirmedPassword.value) {
      this.registerUserForm.controls['confirmedPassword'].setErrors({
        matchError: 'Паролі не збігаються',
      });
    }
  }

  get password(): AbstractControl {
    return this.registerUserForm.controls['password'];
  }

  get confirmedPassword(): AbstractControl {
    return this.registerUserForm.controls['confirmedPassword'];
  }
}
