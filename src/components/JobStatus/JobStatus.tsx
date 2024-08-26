import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { getJobStatus } from '@/services/jobs';
import { Job } from '@/types/job';
import { JOB_STATUS } from '@/constants/status';
import { ErrorMessage } from '@/components/ui';
import { capitalize } from '@/utils/text';
import { ERROR_MESSAGES } from '@/constants/errors';

import styles from './JobStatus.module.scss';

interface JobStatusProps {
  job: Job | null;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const INTERVAL_TIME = 5000;

const JobStatus = ({ job, isLoading, setIsLoading }: JobStatusProps) => {
  const [status, setStatus] = useState<string>(JOB_STATUS.LOADING);
  const [urls, setUrls] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!job) return;

    const fetchJobStatus = async () => {
      if (message) setMessage(null);

      const {
        success,
        data,
        message: responseMessage,
      } = await getJobStatus(job.id);

      if (success && data) {
        setStatus(data.status);
        setUrls(data.foundUrls);
        setIsLoading(false);

        if (
          data.status === JOB_STATUS.COMPLETED ||
          data.status === JOB_STATUS.FAILED
        ) {
          clearInterval(interval);

          if (data.status === JOB_STATUS.FAILED) {
            setMessage(ERROR_MESSAGES.FAILED_JOB_STATUS_FETCH);
          }
        }
      }
      if (!success && responseMessage) {
        setError(true);
        setIsLoading(false);
        setMessage(
          responseMessage || ERROR_MESSAGES.JOB_FAILED_DURING_CRAWLING,
        );
        clearInterval(interval);
      }
    };

    setStatus(JOB_STATUS.LOADING);
    setUrls([]);

    const interval = setInterval(() => {
      fetchJobStatus();
    }, INTERVAL_TIME);

    fetchJobStatus();

    return () => clearInterval(interval);
  }, [job, setIsLoading]);

  return (
    <div
      className={clsx(styles['job-status'], {
        [styles['job-status--loading']]: isLoading,
      })}
    >
      {!isLoading && job && !error && (
        <>
          <div className={styles['job-status__stats']}>
            <h4 className={styles['job-status__stats__heading']}>Stats:</h4>
            <div className={styles['job-status__stats__status']}>
              --&gt;
              <span className={styles['job-status__stats__status__title']}>
                Status:
              </span>
              <span>{capitalize(status)}</span>
            </div>
            <div className={styles['job-status__stats__status']}>
              --&gt;
              <span className={styles['job-status__stats__status__title']}>
                Total URLs Found:
              </span>
              <span>{urls.length}</span>
            </div>
          </div>
          <div className={styles['job-status__urls']}>
            <h4 className={styles['job-status__urls__heading']}>URLs Found:</h4>
            {status === JOB_STATUS.COMPLETED && (
              <>
                {urls.length === 0 && (
                  <p className={styles['job-status__no-urls']}>
                    No URLs were found during the crawl. This might be due to
                    the website's structure or lack of links on the page.
                  </p>
                )}
                <ul>
                  {urls.map((url, index) => (
                    <li key={index}>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </>
      )}
      {isLoading && (
        <div role="status" className={styles['job-status__loading']} />
      )}
      <ErrorMessage message={message} error={error} />
    </div>
  );
};

export default JobStatus;
