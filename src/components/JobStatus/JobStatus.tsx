import { useEffect, useState } from 'react';

import { getJobStatus } from '@/services/jobs';
import { JOB_STATUS } from '@/constants/status';

import styles from './JobStatus.module.scss';

interface JobStatusProps {
  jobId: string;
}

const INTERVAL_TIME = 5000;

const JobStatus = ({ jobId }: JobStatusProps) => {
  const [status, setStatus] = useState<string>(JOB_STATUS.LOADING);
  const [urls, setUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchJobStatus = async () => {
      const { success, data } = await getJobStatus(jobId);

      if (success && data) {
        setStatus(data.status);
        setUrls(data.foundUrls);
        setIsLoading(false);
      }
    };

    fetchJobStatus();

    const interval = setInterval(() => {
      fetchJobStatus();
    }, INTERVAL_TIME);

    return () => clearInterval(interval);
  }, [jobId]);

  return (
    <div className={styles['job-status']}>
      <h3 className={styles['job-status__heading']}>Job Status</h3>
      <p className={styles['job-status__status']}>
        <strong>Status:</strong> {status}
      </p>
      {status === JOB_STATUS.COMPLETED && (
        <div className={styles['job-status__urls']}>
          <h4>URLs Found:</h4>
          <ul>
            {urls.map((url, index) => (
              <li key={index}>{url}</li>
            ))}
          </ul>
        </div>
      )}
      {isLoading && <div className={styles['job-status__loading']} />}
    </div>
  );
};

export default JobStatus;
