import { IRouter } from '../../../../src/core/server';
import { schema } from '@kbn/config-schema';

export function defineRoutes(router: IRouter) {
  router.get(
    {
      path: '/api/cs598/example',
      validate: false,
    },
    async (context, req, res) => {
      return res.ok({
        body: {
          time: new Date().toISOString()
        },
      });
    }
  );

  router.get(
    {
      path: '/api/cs598/alerts',
      validate: {
        query: schema.object({
          from: schema.number({min: 0}),
          size: schema.number({min: 0}),
          searchquery: schema.string({minLength: 0})
        })
      },
    },
    async (context, req, resp) => {
      const { from, size, searchquery } = req.query;

      try {
        const core = await context.core;
        const result = await core.elasticsearch.client.asCurrentUser.search({
          index: '.ds-logs-carbon_black_cloud.watchlist_hit-default-2024.12.10-000001',
          body: {
            from: from,
            _source: [
              'agent',
              'process',
              'carbon_black_cloud'
            ],
            query: {
              prefix: {
                "carbon_black_cloud.watchlist_hit.report.name": {
                  value: searchquery
                }
              }
            },
            size: size
          }
        });
        
        return resp.ok({
          body: result.hits.hits
        });
      } catch (error) {
        return resp.customError({
          statusCode: 500,
          body: {
            message: 'Error retrieving data'
          },
        });
      }
    }
  );

  // Endpoint to fetch documents matching multiple fields
  // http://localhost:5601/api/cs598/search?fields=["carbon_black_cloud.endpoint_event.device.external_ip","process.pid"]&values=["130.126.255.205","6496"]&size=5
  router.post(
    {
      path: '/api/cs598/search',
      validate: {
        query: schema.object({
          from: schema.number({min: 0}),
          size: schema.number({min: 0}),
        }),
        body: schema.object({}, { unknowns: 'allow' }),
      },
    },
    async (context, request, response) => {
      const { from, size } = request.query;

      if (!request?.body) {
        return response.badRequest({
          body: 'Missing payload',
        });
      }

      const fields = Object.keys(request.body);
      const matchConditions = fields.map((field: string) => ({
        match: {
          [field]: (request.body as any)[field],
        },
      }));

      try {
        const core = await context.core;
        const result = await core.elasticsearch.client.asCurrentUser.search({
          from: from,
          index: '.ds-logs-carbon_black_cloud.endpoint_event-default-2024.12.10-000001',
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
            message: `Error retrieving matching data: ${error.message || error}`,
          },
        });
      }
    }
  );
}