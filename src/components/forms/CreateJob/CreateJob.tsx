import { FormEvent, useState } from 'react';

import { Button, ErrorMessage, InputField } from '@/components/ui';
import { createJob } from '@/services/jobs';
import { Job } from '@/types/job';
import { ERROR_MESSAGES } from '@/constants/errors';

import styles from './CreateJob.module.scss';

interface CreateJobProps {
  onJobCreated: (newJob: Job) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const CreateJob = ({
  onJobCreated,
  isLoading,
  setIsLoading,
}: CreateJobProps) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (error) setError(false);
    if (message) setMessage(null);
    if (!url) return setError(true);

    setIsLoading(true);

    const { success, data, message: responseMessage } = await createJob(url);

    if (success && data) {
      onJobCreated(data);
    }
    if (!success && responseMessage) {
      setIsLoading(false);
      setError(true);
      setMessage(responseMessage || ERROR_MESSAGES.FAILED_CREATE_JOB);
    }
  };

  return (
    <div className={styles['create-job']}>
      <h2 className={styles['create-job__heading']}>
        Create a New Crawling Job
      </h2>
      <form className={styles['create-job__form']} onSubmit={handleSubmit}>
        <InputField
          label="URL"
          name="url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          showError={error && !url}
          placeholder="Enter the root URL"
        />
        <ErrorMessage error={error} message={message} />
        <Button type="submit" disabled={isLoading || !url} variant="primary">
          {isLoading ? 'Creating Job...' : 'Create Job'}
        </Button>
      </form>
    </div>
  );
};

export default CreateJob;
