import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { EndpointsPluginSetup, EndpointsPluginStart } from './types';
import { defineRoutes } from './routes';

export class EndpointsPlugin implements Plugin<EndpointsPluginSetup, EndpointsPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('endpoints: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('endpoints: Started');
    return {};
  }

  public stop() {}
}
