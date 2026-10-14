import { Module } from '@nestjs/common';
import { AdminProfileModule } from './admin-profile/admin-profile.module.js';

@Module({
  imports: [AdminProfileModule],
})
export class TeamModule {}
