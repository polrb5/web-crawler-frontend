import { useEffect, useState } from 'react';
import { getJobStatus } from '@/services/jobs';
import { Job } from '@/types/job';
import { JOB_STATUS } from '@/constants/status';
import styles from './JobStatus.module.scss';
import { ErrorMessage } from '@/components/ui';
import { capitalize } from '@/utils/text';
import clsx from 'clsx';
import { ERROR_MESSAGES } from '@/constants/errors';

interface JobStatusProps {
  job: Job | null;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const INTERVAL_TIME = 5000;

const JobStatus = ({ job, isLoading, setIsLoading }: JobStatusProps) => {
  const [status, setStatus] = useState<string>(JOB_STATUS.LOADING);
  const [urls, setUrls] = useState<string[]>([]);
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
      {!isLoading && job && (
        <>
          <div className={styles['job-status__stats']}>
            <h4 className={styles['job-status__stats__heading']}>Stats:</h4>
            <p className={styles['job-status__stats__status']}>
              --&gt; <strong>Status:</strong> {capitalize(status)}
            </p>
            <p className={styles['job-status__stats__status']}>
              --&gt; <strong>Total URLs Found:</strong> {urls.length}
            </p>
          </div>
          <ErrorMessage message={message} />
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
      {isLoading && <div className={styles['job-status__loading']} />}
    </div>
  );
};

export default JobStatus;
