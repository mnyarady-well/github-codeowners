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
  const dirCountLoved = new Map<string, Counters>();
  const dirCountUnloved = new Map<string, Counters>();

  for (const file of files) {
    total.files++;
    total.lines += file.lines;

    if (file.owners.length < 1) {
      unloved.files++;
      unloved.lines += file.lines;

      const dir = file.path.indexOf('/') >= 0 ? file.path.split('/')[0] : '!ROOT';
      const dCount = dirCountUnloved.get(dir) || { files: 0, lines: 0 };
      dCount.files++;
      if(typeof file.lines === 'number') dCount.lines += file.lines;
      dirCountUnloved.set(dir, dCount);
    } else {
      const dir = file.path.indexOf('/') >= 0 ? file.path.split('/')[0] : '!ROOT';
      const dCount = dirCountLoved.get(dir) || { files: 0, lines: 0 };
      dCount.files++;
      if(typeof file.lines === 'number') dCount.lines += file.lines;
      dirCountLoved.set(dir, dCount);

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
    directoriesLoved: Array.from(dirCountLoved.keys()).map((dir) => {
      const counts = dirCountLoved.get(dir);
      return {
        dir,
        counters: {
          files: counts ? counts.files : 0,
          lines: counts ? counts.lines : 0,
        },
      };
    }),
    directoriesUnloved: Array.from(dirCountUnloved.keys()).map((dir) => {
      const counts = dirCountUnloved.get(dir);
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
