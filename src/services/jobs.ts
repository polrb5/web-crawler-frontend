import response from '@/services/lib/response';
import { ApiResponse } from '@/types/services';

const { VITE_API_URL } = import.meta.env;

export const createJob = async (url: string): Promise<ApiResponse<string>> => {
  const query = `
    mutation {
      createCrawlJob(url: "${url}") {
        id
        url
        status
      }
    }
  `;

  try {
    const fetchResponse = await fetch(VITE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const result = await fetchResponse.json();
    const crawlJob = result.data?.createCrawlJob;

    if (crawlJob) {
      return response(true, null, crawlJob);
    }

    return response(false, result.errors[0].message);
  } catch (error) {
    const errorMessage = (error as Error).message || 'Failed to create job';
    return response(false, errorMessage);
  }
};

export const getJobStatus = async (
  jobId: string,
): Promise<ApiResponse<{ status: string; foundUrls: string[] }>> => {
  const query = `
    query {
      getCrawlJob(id: "${jobId}") {
        status
        foundUrls
      }
    }
  `;

  try {
    const fetchResponse = await fetch(VITE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const result = await fetchResponse.json();
    const jobData = result.data?.getCrawlJob;

    if (jobData) {
      return response(true, null, jobData);
    }

    return response(false, result.errors[0].message);
  } catch (error) {
    const errorMessage = (error as Error).message || 'Failed to get job status';
    return response(false, errorMessage);
  }
};
