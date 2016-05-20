import {
  async,
  beforeEach,
  beforeEachProviders,
  describe, xdescribe,
  expect,
  it, xit,
  inject,
  injectAsync
} from 'angular2/testing';

import {
  ComponentFixture,
  TestComponentBuilder,
} from 'angular2/testing';

import { DataService } from '../data/data.service';
import { BundlesComponent } from './bundles.component';
import { NO_LOGIN } from '../common';
import { BaseService } from '../data/base.service';
import { MockbaseService } from '../data/mockbase.service';

import { Component, Input, provide } from 'angular2/core';

//-----------------------------------------------------------------------------

type TCB = TestComponentBuilder;

function log(msg: any, obj: any = "") {
  console.log(msg, obj);
}

//setTimeout that returns a promise
function delay(ms: number): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });
}

function gap(): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve());
  });
}

//-----------------------------------------------------------------------------

type CF = ComponentFixture<BundlesComponent>;

describe('Bundles', () => {

  beforeEachProviders(() => [
    provide(NO_LOGIN, {useValue: true}),
    provide(BaseService, {useClass: MockbaseService}), 
    DataService,
  ]);

  let tcb;
  let fix;
  let element;
  let comp: BundlesComponent; 
  let node;
  
  function checkTable(_rows: number, _cols: number) {
    node = element.querySelectorAll('#data')[0];
    expect(node.nodeName).toBe("TABLE");
    expect(node.rows.length).toBe(_rows);
    expect(node.rows[0].cells.length).toBe(_cols);
    return node;
  }

  function cell(_table, _row: number, _col: number) {
    return _table.rows[_row].cells[_col].textContent.trim();
  }

  it('renders and works fine', inject([TestComponentBuilder], (_tcb: TCB) => {

    return _tcb.createAsync(BundlesComponent).then((_fix: CF) => {
      tcb = _tcb;
      fix = _fix;
      element = fix.nativeElement;
      comp = fix.componentRef.instance; 
      expect(true).toBe(true);
      //HACK: A hack to wait for all to be loaded
      return gap().then(()=> {

        fix.detectChanges();
        //insane sanity check
        expect(element.querySelectorAll('div').length).toBe(2);
        //Should be DAY by default
        expect(comp.isDay()).toBe(true);
        fix.detectChanges();
        
        node = element.querySelectorAll('#addFarm')[0];
        expect(node).not.toBe(null);
        expect(node.textContent).toBe("+");
        node = element.querySelectorAll('#addPlant')[0];
        expect(node).not.toBe(null);
        expect(node.textContent).toBe("+");     

        let f = "farm2";
        let p = "plant5";
        node = checkTable(7, 4);
        expect(cell(node, 0, 2)).toBe(f);
        expect(cell(node, 5, 0)).toBe(p);

        let q = 13;
        comp.addHarvestInternal(f, p, q);
        fix.detectChanges();

        node = checkTable(7, 4);
        expect(cell(node, 5, 2)).toBe(""+q);
        expect(cell(node, 1, 2)).toBe(""+q);
        expect(cell(node, 1, 3)).toBe(""+q);
        expect(cell(node, 5, 3)).toBe(""+q);
        expect(cell(node, 6, 2)).toBe(""+q);
        expect(cell(node, 6, 3)).toBe(""+q);

        f = "FF1";
        comp.addFarmInternal(f);
        fix.detectChanges();

        node = checkTable(7, 5);
        expect(cell(node, 0, 3)).toBe(f);
        
        p = "PP1";
        comp.addPlantInternal(p);
        fix.detectChanges();

        node = checkTable(8, 5);
        expect(cell(node, 6, 0)).toBe(p);

        comp.addHarvestInternal(f, p, q);
        fix.detectChanges();

        node = checkTable(8, 5);
        expect(cell(node, 6, 3)).toBe(""+q);
        expect(cell(node, 1, 3)).toBe(""+q);
        expect(cell(node, 7, 3)).toBe(""+q);
        expect(cell(node, 6, 4)).toBe(""+q);
        expect(cell(node, 7, 4)).toBe(""+26);
        expect(cell(node, 1, 4)).toBe(""+26);
        
        fix.destroy();
      });
    });
  }));

});

