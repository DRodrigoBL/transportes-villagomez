import { Action } from '@ngrx/store';

export const DATE_CHANGED = '[Cargas] Date changed';
export const SAVE_CARGA = '[Cargas] Save carga';
export const UPDATE_CARGA = '[Cargas] Update carga';

export class DateChanged implements Action {
  readonly type = DATE_CHANGED;
}

export class SaveCarga implements Action {
  readonly type = SAVE_CARGA;
}

export class UpdateCarga implements Action {
  readonly type = UPDATE_CARGA;
}

export type CargasActions = DateChanged | SaveCarga | UpdateCarga;
