import { JOB_STATUS } from '@/constants/status';

export type Status = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];

export type Job = {
  id: string;
  url: string;
  status: Status;
  foundUrls: string[];
  createdAt: Date;
  updatedAt: Date;
};
