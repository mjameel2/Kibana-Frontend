import { IRouter } from '../../../../src/core/server';
import { schema } from '@kbn/config-schema';

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
          index: '.ds-logs-carbon_black_cloud.watchlist_hit-default-2024.11.14-000001', // Replace with index you want to search
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

  // Endpoint to fetch documents matching multiple fields
  // http://localhost:5601/api/endpoints/search?fields=["carbon_black_cloud.endpoint_event.device.external_ip","process.pid"]&values=["130.126.255.205","6496"]&size=5
  router.get(
    {
      path: '/api/endpoints/search',
      validate: {
        query: schema.object({
          fields: schema.arrayOf(schema.string(), { minSize: 1 }),
          values: schema.arrayOf(schema.string(), { minSize: 1 }),
          size: schema.maybe(schema.number()), // Optional size of results
        }),
      },
    },
    async (context, request, response) => {
      const { fields, values, size = 10 } = request.query;

      if (fields.length !== values.length) {
        return response.badRequest({
          body: 'Fields and values arrays must have the same length.',
        });
      }

      const matchConditions = fields.map((field, index) => ({
        match: {
          [field]: values[index],
        },
      }));

      try {
        const core = await context.core;
        const result = await core.elasticsearch.client.asCurrentUser.search({
          index: '.ds-logs-carbon_black_cloud.endpoint_event-default-2024.11.14-000001', // Replace with index you want to search
          body: {
            _source: [
              'agent',
              'process',
              'carbon_black_cloud'
            ],
            query: {
              bool: {
                must: matchConditions,
              },
            },
            size
          }
        });

        return response.ok({
          body: result.hits.hits
        });
      } catch (error) {
        return response.customError({
          statusCode: 500,
          body: {
            message: 'Error retrieving matching data',
          },
        });
      }
    }
  );
}