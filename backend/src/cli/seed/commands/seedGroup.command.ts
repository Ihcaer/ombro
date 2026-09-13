import { Command, CommandRunner } from 'nest-commander';
import { SeedAdminSubCommand } from './seed-admin.sub-command';

@Command({
  name: 'seed',
  description: 'A group of commands for seeding the database',
  subCommands: [SeedAdminSubCommand],
})
export class SeedGroupCommand extends CommandRunner {
  async run(): Promise<void> {
    this.command.outputHelp();
    return Promise.resolve();
  }
}
