import { useState } from 'react';

import { Job } from '@/types/job';
import CreateJob from '@/components/forms/CreateJob';
import JobStatus from '@/components/JobStatus/JobStatus';

import styles from './JobManager.module.scss';

const JobManager = () => {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleJobCreated = (newJob: Job) => {
    setJob(newJob);
  };

  return (
    <div className={styles.content}>
      <CreateJob
        onJobCreated={handleJobCreated}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      <JobStatus job={job} isLoading={isLoading} setIsLoading={setIsLoading} />
    </div>
  );
};

export default JobManager;
