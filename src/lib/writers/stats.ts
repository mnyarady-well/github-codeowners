import { Stats } from '../stats';
import { OUTPUT_FORMAT } from './types';

export const writer = (stats: Stats, options: { output: OUTPUT_FORMAT }, stream: any) => {
  const orderedOwners = [...stats.owners].sort((a, b) => {
    if (a.owner < b.owner) return -1;
    if (a.owner > b.owner) return 1;
    return 0;
  });

  const orderedDirs = [...stats.directories].sort((a, b) => {
    if (a.dir < b.dir) return -1;
    if (a.dir > b.dir) return 1;
    return 0;
  });

  switch (options.output) {
    case(OUTPUT_FORMAT.JSONL):
      stream.write(`${JSON.stringify(stats)}\n`);
      break;
    case(OUTPUT_FORMAT.CSV):
      stream.write(`owner,files,lines\n`);
      stream.write(`total,${stats.total.files},${stats.total.lines}\n`);
      stream.write(`loved,${stats.loved.files},${stats.loved.lines}\n`);
      stream.write(`unloved,${stats.unloved.files},${stats.unloved.lines}\n`);
      orderedOwners.forEach((owner) => {
        stream.write(`${owner.owner},${owner.counters.files},${owner.counters.lines}\n`);
      });
      orderedDirs.forEach((dir) => {
        stream.write(`${dir.dir},${dir.counters.files},${dir.counters.lines}\n`);
      });
      break;
    default:
      stream.write('\n--- Counts ---\n');
      stream.write(`Total: ${stats.total.files} files (${stats.total.lines} lines)\n`);
      stream.write(`Loved: ${stats.loved.files} files (${stats.loved.lines} lines)\n`);
      stream.write(`Unloved: ${stats.unloved.files} files (${stats.unloved.lines} lines)\n`);
      stream.write('--- Owners ---\n');
      const owners = orderedOwners.map(owner => `${owner.owner}: ${owner.counters.files} files (${owner.counters.lines} lines)`).join('\n');
      stream.write(`${owners}\n`);
      stream.write('--- Owners ---\n');
      const dirs = orderedDirs.map(dir => `${dir.dir}: ${dir.counters.files} files (${dir.counters.lines} lines)`).join('\n');
      stream.write(`${dirs}\n`);
      break;
  }
};
