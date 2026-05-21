import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { primitives } from './primitive/primitives';
import { semantic } from './semantic/semantic';
import { components } from './components/components';

export const DefaultPreset = definePreset(Aura, {
  primitive: primitives,
  semantic: semantic,
  components: components,
});
