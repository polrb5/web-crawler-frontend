import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateJob from '@/components/forms/CreateJob/CreateJob';
import { createJob } from '@/services/jobs';
import { JOB_STATUS } from '@/constants/status';

vi.mock('@/services/jobs', () => ({ createJob: vi.fn() }));

describe('CreateJob Component', () => {
  const onJobCreatedMock = vi.fn();
  const setIsLoadingMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(
      <CreateJob
        onJobCreated={onJobCreatedMock}
        isLoading={false}
        setIsLoading={setIsLoadingMock}
      />,
    );
    expect(screen.getByText('Create a New Crawling Job')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter the root URL'),
    ).toBeInTheDocument();
    expect(screen.getByText('Create Job')).toBeInTheDocument();
  });

  it('disables the button when loading', () => {
    render(
      <CreateJob
        onJobCreated={onJobCreatedMock}
        isLoading={true}
        setIsLoading={setIsLoadingMock}
      />,
    );
    expect(screen.getByText('Creating Job...')).toBeDisabled();
  });

  it('shows an error message when URL is missing', async () => {
    render(
      <CreateJob
        onJobCreated={onJobCreatedMock}
        isLoading={false}
        setIsLoading={setIsLoadingMock}
      />,
    );

    fireEvent.submit(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/This field is required/i)).toBeInTheDocument();
    });
  });

  it('calls onJobCreated after successful job creation', async () => {
    const jobMock = {
      id: '1',
      url: 'http://example.com',
      status: JOB_STATUS.IN_PROGRESS, // Use a valid status from the JOB_STATUS object
      foundUrls: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const createJobMock = vi
      .mocked(createJob)
      .mockResolvedValue({ success: true, data: jobMock });

    render(
      <CreateJob
        onJobCreated={onJobCreatedMock}
        isLoading={false}
        setIsLoading={setIsLoadingMock}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('Enter the root URL'), {
      target: { value: 'http://example.com' },
    });
    fireEvent.submit(screen.getByRole('button'));

    await waitFor(() => {
      expect(createJobMock).toHaveBeenCalledWith('http://example.com');
      expect(onJobCreatedMock).toHaveBeenCalledWith(jobMock);
      expect(setIsLoadingMock).toHaveBeenCalledWith(true);
    });
  });

  it('shows an error message when job creation fails', async () => {
    const createJobMock = vi
      .mocked(createJob)
      .mockResolvedValue({ success: false, message: 'Failed to create job' });

    render(
      <CreateJob
        onJobCreated={onJobCreatedMock}
        isLoading={false}
        setIsLoading={setIsLoadingMock}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('Enter the root URL'), {
      target: { value: 'http://example.com' },
    });
    fireEvent.submit(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/Failed to create job/i)).toBeInTheDocument();
      expect(setIsLoadingMock).toHaveBeenCalledWith(true);
      expect(setIsLoadingMock).toHaveBeenCalledWith(false);
    });
  });
});
