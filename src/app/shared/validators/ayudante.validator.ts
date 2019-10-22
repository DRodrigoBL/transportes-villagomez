import { AbstractControl } from '@angular/forms';

export const ayudanteValidator = (
  control: AbstractControl
): { [key: string]: boolean } => {
  const hasAyudante = control.get('hasAyudante');
  const ayudante = control.get('ayudante');

  console.log('validando ayudante: ');
  console.log('hasAyudante: ' + hasAyudante.value);
  console.log(ayudante);
  if (!hasAyudante.value) {
    return null;
  }
  if (hasAyudante.value && ayudante) {
    return null;
  }
  return { nomatch: true };
};
