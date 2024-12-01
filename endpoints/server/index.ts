import { PluginInitializerContext } from '../../../src/core/server';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export async function plugin(initializerContext: PluginInitializerContext) {
  const { EndpointsPlugin } = await import('./plugin');
  return new EndpointsPlugin(initializerContext);
}

export type { EndpointsPluginSetup, EndpointsPluginStart } from './types';
