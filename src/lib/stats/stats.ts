import { Counters, File, Stats } from './types';

export const calcFileStats = (files: File[]): Stats => {
  const total: Counters = {
    files: 0,
    lines: 0,
  };

  const unloved: Counters = {
    files: 0,
    lines: 0,
  };

  const ownerCount = new Map<string, Counters>();
  const dirCount = new Map<string, Counters>();

  for (const file of files) {
    total.files++;
    total.lines += file.lines;

    if (file.owners.length < 1) {
      unloved.files++;
      unloved.lines += file.lines;

      const dir = file.path.indexOf('/') >= 0 ? file.path.split('/')[0] : '!ROOT';
      const dCount = dirCount.get(dir) || { files: 0, lines: 0 };
      dCount.files++;
      if(typeof file.lines === 'number') dCount.lines += file.lines;
      dirCount.set(dir, dCount);
    } else {
      for (const owner of file.owners) {
        const counts = ownerCount.get(owner) || { files: 0, lines: 0 };
        counts.files++;
        counts.lines += file.lines;
        ownerCount.set(owner, counts);
      }
    }
}

  return {
    total,
    unloved,
    loved: {
      files: total.files - unloved.files,
      lines: total.lines - unloved.lines,
    },
    owners: Array.from(ownerCount.keys()).map((owner) => {
      const counts = ownerCount.get(owner);
      return {
        owner,
        counters: {
          files: counts ? counts.files : 0,
          lines: counts ? counts.lines : 0,
        },
      };
    }),
    directories: Array.from(dirCount.keys()).map((dir) => {
      const counts = dirCount.get(dir);
      return {
        dir,
        counters: {
          files: counts ? counts.files : 0,
          lines: counts ? counts.lines : 0,
        },
      };
    }),
  };
};
