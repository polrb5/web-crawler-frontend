import { useState } from 'react';

import CreateJob from '@/components/forms/CreateJob';
import JobStatus from '@/components/JobStatus/JobStatus';

import styles from './JobManager.module.scss';

const JobManager = () => {
  const [jobId, setJobId] = useState<string | null>(null);

  const handleJobCreated = (newJobId: string) => {
    setJobId(newJobId);
  };

  return (
    <div className={styles.content}>
      <CreateJob onJobCreated={handleJobCreated} />
      {jobId && <JobStatus jobId={jobId} />}
    </div>
  );
};

export default JobManager;
