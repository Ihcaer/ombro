import { Job } from 'bullmq';

export interface IJobHandler<TPayload = any> {
  handle(data: TPayload, job?: Job): Promise<void>;
}
