import { IRouter } from '../../../../src/core/server';

export function defineRoutes(router: IRouter) {
  router.get(
    {
      path: '/api/endpoints/example',
      validate: false,
    },
    async (context, request, response) => {
      try {
        const core = await context.core;
        const result = await core.elasticsearch.client.asCurrentUser.search({
          index: '.ds-logs-carbon_black_cloud.watchlist_hit-default-2024.11.27-000001', // Replace with index you want to search
          body: {
            _source: [
              'agent', // Retrieve agent field
              'process', // Retrieve process field
              'carbon_black_cloud' // Retrieve carbon_black_cloud field
            ],
            query: {
              match_all: {} // Return all documents
            },
            size: 10 // Limit the results to 10 documents
          }
        });
        
        return response.ok({
          body: result.hits.hits
        });
      } catch (error) {
        // Handle errors from Elasticsearch query
        return response.customError({
          statusCode: 500,
          body: {
            message: 'Error retrieving data',
          },
        });
      }
    }
  );
}