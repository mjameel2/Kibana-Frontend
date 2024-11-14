import { PluginInitializerContext } from '../../../src/core/server';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export async function plugin(initializerContext: PluginInitializerContext) {
  const { BarPlugin } = await import('./plugin');
  return new BarPlugin(initializerContext);
}

export type { BarPluginSetup, BarPluginStart } from './types';
