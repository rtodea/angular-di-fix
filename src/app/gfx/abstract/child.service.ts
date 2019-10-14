import { Injectable } from '@angular/core';

@Injectable()
export abstract class ChildService {
  abstract create();
}
