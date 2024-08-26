import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import JobStatus from '@/components/JobStatus/JobStatus';
import { getJobStatus } from '@/services/jobs';
import { JOB_STATUS } from '@/constants/status';

vi.mock('@/services/jobs', () => ({ getJobStatus: vi.fn() }));

describe('JobStatus Component', () => {
  const setIsLoadingMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when loading', () => {
    render(
      <JobStatus job={null} isLoading={true} setIsLoading={setIsLoadingMock} />,
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders job status correctly after fetching', async () => {
    const jobMock = {
      status: JOB_STATUS.COMPLETED,
      foundUrls: ['http://example.com', 'http://example.org'],
    };
    const getJobStatusMock = vi
      .mocked(getJobStatus)
      .mockResolvedValue({ success: true, data: jobMock });

    const jobProp = {
      id: '1',
      url: 'http://example.com',
      status: JOB_STATUS.IN_PROGRESS,
      foundUrls: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(
      <JobStatus
        job={jobProp}
        isLoading={false}
        setIsLoading={setIsLoadingMock}
      />,
    );

    await waitFor(() => {
      expect(getJobStatusMock).toHaveBeenCalledWith('1');

      const statusElement = screen.getByText(/Status:/i);
      expect(statusElement).toHaveTextContent(/Status:/i);
      expect(statusElement.nextElementSibling).toHaveTextContent(/Completed/i);

      expect(
        screen.getByText(/Total URLs Found:/i).nextElementSibling,
      ).toHaveTextContent('2');
    });
  });

  it('displays no URLs found message when no URLs are found', async () => {
    const jobMock = {
      status: JOB_STATUS.COMPLETED,
      foundUrls: [],
    };
    const getJobStatusMock = vi
      .mocked(getJobStatus)
      .mockResolvedValue({ success: true, data: jobMock });

    const jobProp = {
      id: '1',
      url: 'http://example.com',
      status: JOB_STATUS.IN_PROGRESS,
      foundUrls: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(
      <JobStatus
        job={jobProp}
        isLoading={false}
        setIsLoading={setIsLoadingMock}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/No URLs were found during the crawl/i),
      ).toBeInTheDocument();
    });
  });

  it('displays an error message when fetching fails', async () => {
    // Mock the `getJobStatus` function to return an error response
    const getJobStatusMock = vi
      .mocked(getJobStatus)
      .mockResolvedValue({
        success: false,
        message: 'Failed to fetch job status',
      });

    const jobProp = {
      id: '1',
      url: 'http://example.com',
      status: JOB_STATUS.IN_PROGRESS,
      foundUrls: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Render the JobStatus component
    render(
      <JobStatus
        job={jobProp}
        isLoading={false}
        setIsLoading={setIsLoadingMock}
      />,
    );

    // Wait for the component to handle the error and update the DOM
    await waitFor(() => {
      // Check if the error message is displayed
      expect(
        screen.getByText(/Failed to fetch job status/i),
      ).toBeInTheDocument();
    });
  });

  it('clears the interval and stops loading when the job is completed or failed', async () => {
    const jobMock = {
      status: JOB_STATUS.COMPLETED,
      foundUrls: ['http://example.com'],
    };
    const getJobStatusMock = vi
      .mocked(getJobStatus)
      .mockResolvedValue({ success: true, data: jobMock });

    const jobProp = {
      id: '1',
      url: 'http://example.com',
      status: JOB_STATUS.IN_PROGRESS,
      foundUrls: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(
      <JobStatus
        job={jobProp}
        isLoading={false}
        setIsLoading={setIsLoadingMock}
      />,
    );

    await waitFor(() => {
      expect(setIsLoadingMock).toHaveBeenCalledWith(false);
      expect(getJobStatusMock).toHaveBeenCalledTimes(1);
    });
  });
});
