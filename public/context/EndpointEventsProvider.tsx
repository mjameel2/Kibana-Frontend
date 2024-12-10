import React, { createContext, useContext, useEffect } from 'react';

// Kibana libraries
import type { CoreStart } from '@kbn/core/public';

// External libraries
import { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, useInfiniteQuery } from '@tanstack/react-query';

// My Libraries
import { FocusedWatchlistHitContext } from './FocusedWatchlistHitProvider';
import { ENDPOINT_EVENTS_ENDPOINT, ENDPOINT_EVENTS_PAGE_SIZE } from '../../common/constants';

async function fetchEndpointEvents({ pageParam = 0, queryKey }, http: CoreStart['http']) {
  const [_key, { pageSize, focusedWatchlistHit }] = queryKey;
  
  if (!focusedWatchlistHit) {
    return [];
  }

  // Endpoint to fetch documents matching multiple fields
  // http://localhost:5601/api/cs598/search?fields=["carbon_black_cloud.endpoint_event.device.external_ip","process.pid"]&values=["130.126.255.205","6496"]&size=5
  const external_ip = focusedWatchlistHit?._source?.carbon_black_cloud?.watchlist_hit?.device?.external_ip;
  const pid = focusedWatchlistHit?._source?.process?.pid;
  const url = http.basePath.prepend(`${ENDPOINT_EVENTS_ENDPOINT}?from=${pageParam}&size=${pageSize}`);
  const response = await fetch(
    url,
    {
      method: 'POST',
      headers: {
        'kbn-xsrf': 'kibana',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'carbon_black_cloud.endpoint_event.device.external_ip': external_ip,
        'process.pid': pid
      })
    }
  );
  const data = await response.json();
  return data;
};

interface EndpointEventsProviderContextProps {
  data: InfiniteData<any> | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<any, unknown>>
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
} 

const EndpointEventsProviderContext = createContext<EndpointEventsProviderContextProps>(null!);

interface EndpointEventsProviderProps {
  children: React.ReactNode;
  http: CoreStart['http'];
}

const EndpointEventsProvider = ({ children, http }: EndpointEventsProviderProps) => {
  const { focusedWatchlistHit } = useContext(FocusedWatchlistHitContext);
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery(
    ['paginatedData', { pageSize: ENDPOINT_EVENTS_PAGE_SIZE, focusedWatchlistHit }],
    (_) => fetchEndpointEvents(_, http),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage && lastPage.length < ENDPOINT_EVENTS_PAGE_SIZE ? false : allPages.length;
      },
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  useEffect(() => {
    refetch();
  }, [focusedWatchlistHit, refetch]);

  const initialValue = { 
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
  
  return (
    <EndpointEventsProviderContext.Provider value={initialValue}>
      {children}
    </EndpointEventsProviderContext.Provider>
  );
};

export {
  EndpointEventsProviderContext,
  EndpointEventsProvider
};