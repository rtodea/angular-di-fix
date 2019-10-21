import { Injectable } from '@angular/core';

@Injectable()
export abstract class ChildService {
  id: number;

  constructor() {
    this.id = Math.random();
  }

  abstract create();
}
