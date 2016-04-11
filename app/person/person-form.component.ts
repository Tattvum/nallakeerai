import { Component } from 'angular2/core';
import { NgForm }    from 'angular2/common';
import { Person }    from './person';
import { RemoteService }   from '../remote/remote.service';

@Component({
  selector: 'person-form',
  templateUrl: 'app/person/person-form.component.html'
})
export class PersonFormComponent {
  types = ['Cool', 'Smart', 'Moody', 'Grumpy'];
  model = new Person(2, 'Robind', 'Smart', 'Wants to be kind');
  submitted = false;
  active = true;

  constructor(private _service: RemoteService) {}

  onSubmit() {
    this.submitted = true;
    this._service.post(JSON.stringify(this.model)).then(res => console.log(res));
  }

  newPerson() {
    this.model = new Person(42, '', '', '');
    this.active = false;
    setTimeout(()=> this.active=true, 0);
  }

  get diagnostic() { return JSON.stringify(this.model); }
}
