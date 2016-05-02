import {Injector, provide} from 'angular2/core';
import {Http, BaseRequestOptions} from 'angular2/http';
import {MockBackend} from 'angular2/http/testing';

import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject,
  injectAsync
} from 'angular2/testing';

import { DataService } from './data.service';
import { FirebaseService } from './firebase.service';
import { MockbaseService } from './mockbase.service';

//-----------------------------------------------------------------------------

xdescribe('DataService', () => {

  
  beforeEachProviders( () => [ MockbaseService, DataService ] );
  
  it('dummy test', inject([DataService], (service: DataService) => {
    return Promise.resolve().then((arr) => {
      expect(true).toEqual(true);
    });
  }));

});
