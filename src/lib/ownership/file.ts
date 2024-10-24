import * as path from 'path';
import { OwnedFile } from './lib/OwnedFile';
import { OwnershipEngine } from './lib/OwnershipEngine';
import { readDirRecursively } from './lib/readDirRecursively';
import { readTrackedGitFiles } from './lib/readTrackedGitFiles';

export const getFileOwnership = async (options: { codeowners: string, dir: string, onlyGit: boolean, root?: string }): Promise<OwnedFile[]> => {
  const engine = OwnershipEngine.FromCodeownersFile(options.codeowners);

  let filePaths;
  if (options.onlyGit) {
    filePaths = await readTrackedGitFiles(options.dir);
  } else {
    filePaths = await readDirRecursively(options.dir, ['.git']);
  }

  // TODO Move this to config

  // General
  filePaths = filePaths.filter(f => f.indexOf('/core/') === -1);
  filePaths = filePaths.filter(f => f.indexOf('/foundation/migrations') === -1);
  filePaths = filePaths.filter(f => f.endsWith('.ts') || f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.tsx'));
  
  // Maximus
  filePaths = filePaths.filter(f => f !== 'Maximus/.dependency-cruiser.js');
  filePaths = filePaths.filter(f => !f.startsWith('Maximus/codemods/'));
  filePaths = filePaths.filter(f => f.indexOf('jest.config') === -1);
  filePaths = filePaths.filter(f => f.indexOf('jest.base') === -1);
  filePaths = filePaths.filter(f => !f.startsWith('Maximus/jest/'));
  filePaths = filePaths.filter(f => !f.endsWith('/index.ts'));

  // Gluteus
  filePaths = filePaths.filter(f => !f.endsWith('.d.ts'));
  filePaths = filePaths.filter(f => !f.endsWith('/global.ts'));
  filePaths = filePaths.filter(f => !f.endsWith('/fixture.ts'));
  filePaths = filePaths.filter(f => !f.endsWith('/testPrep.ts'));
  filePaths = filePaths.filter(f => !f.endsWith('/split-treatments.enum.ts'));
  filePaths = filePaths.filter(f => !f.endsWith('/treatment-status.enum.ts'));
  filePaths = filePaths.filter(f => !f.endsWith('/treatment-with-config.type.ts'));
  filePaths = filePaths.filter(f => !f.endsWith('/testPrep.ts'));
  filePaths = filePaths.filter(f => !f.endsWith('/@types/module.ts'));
  filePaths = filePaths.filter(f => f.indexOf('jest.config') === -1);
  filePaths = filePaths.filter(f => f.indexOf('test-setup') === -1);
  filePaths = filePaths.filter(f => !f.endsWith('/foundation/log.ts'));
  filePaths = filePaths.filter(f => !f.endsWith('postgres-big-int.type.ts'));
  filePaths = filePaths.filter(f => !f.endsWith('fixture_factories.ts'));
  filePaths = filePaths.filter(f => f.indexOf('fixture_state') === -1);
  filePaths = filePaths.filter(f => !f.endsWith('practiceAndLineHelpers.ts'));
  filePaths = filePaths.filter(f => !f.endsWith('userHelpers.ts'));
  filePaths = filePaths.filter(f => !f.endsWith('test-data-setup-helpers.ts'));
  filePaths = filePaths.filter(f => f.indexOf('github-actions.test-sequencer') === -1);
  filePaths = filePaths.filter(f => !f.endsWith('global-migrate.ts'));
  filePaths = filePaths.filter(f => !f.endsWith('testConsts.ts'));
  filePaths = filePaths.filter(f => !f.endsWith('testSetup.ts'));
  filePaths = filePaths.filter(f => !f.endsWith('WELL-Server-Jobs/config.ts'));
  filePaths = filePaths.filter(f => f.indexOf('WELL-Server-Webhooks/cloud/errors/') === -1);
  filePaths = filePaths.filter(f => f.indexOf('jest-idea.config.js') === -1);

  // FEnotype
  filePaths = filePaths.filter(f => f.indexOf('.storybook/') === -1);
  filePaths = filePaths.filter(f => f.indexOf('cypress.config.js') === -1);
  filePaths = filePaths.filter(f => f.indexOf('WellApp/cypress/fixtures/') === -1);
  filePaths = filePaths.filter(f => f.indexOf('DD-42.spec.js') === -1);
  filePaths = filePaths.filter(f => f.indexOf('WellApp/cypress/integration/dummy') === -1);
  filePaths = filePaths.filter(f => f.indexOf('WellApp/cypress/support/') === -1);
  filePaths = filePaths.filter(f => f.indexOf('WellApp/src/Constants/Forms.js') === -1);
  filePaths = filePaths.filter(f => f.indexOf('WellApp/src/Gql/index.tsx') === -1);
  filePaths = filePaths.filter(f => f.indexOf('WellApp/src/codegen.ts') === -1);
  filePaths = filePaths.filter(f => f.indexOf('WellApp/static/js/polyfills.js') === -1);
  filePaths = filePaths.filter(f => f.indexOf('WellApp/static/js/typeform.min.js') === -1);
  filePaths = filePaths.filter(f => f.indexOf('WellApp/tests/setupRtl.js') === -1);
  filePaths = filePaths.filter(f => f.indexOf('WellApp/webpack.config.js') === -1);
  filePaths = filePaths.filter(f => f.indexOf('cypress.config.js') === -1);
  filePaths = filePaths.filter(f => f.indexOf('cypress/standalone/index.jsx') === -1);
  filePaths = filePaths.filter(f => f.indexOf('eslint-local-rules') === -1);
  filePaths = filePaths.filter(f => f.indexOf('jest.base.js') === -1);
  filePaths = filePaths.filter(f => f.indexOf('jest.runAll.js') === -1);
  filePaths = filePaths.filter(f => f.indexOf('lint-staged.config.js') === -1);
  filePaths = filePaths.filter(f => f.indexOf('migration/shared-imports.js') === -1);
  filePaths = filePaths.filter(f => f.indexOf('playwright.config.ts') === -1);
  filePaths = filePaths.filter(f => f.indexOf('plop/plopfile.js') === -1);
  filePaths = filePaths.filter(f => !f.startsWith('FEnotype/static/'));
  filePaths = filePaths.filter(f => !f.startsWith('FEnotype/webpack.'));
  filePaths = filePaths.filter(f => !f.endsWith('/index.js'));
  filePaths = filePaths.filter(f => !f.endsWith('/globals.js'));

  if (options.root) { // We need to re-add the root so that later ops can find the file
    filePaths = filePaths.map(filePath => path.join(<string>options.root, filePath));
  }

  filePaths.sort();

  const files: OwnedFile[] = [];

  for (const filePath of filePaths) {
    files.push(await OwnedFile.FromPath(filePath, engine));
  }

  return files;
};
