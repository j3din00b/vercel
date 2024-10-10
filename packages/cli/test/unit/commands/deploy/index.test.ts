import { describe, expect, it } from 'vitest';
import bytes from 'bytes';
import fs from 'fs-extra';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { fileNameSymbol } from '@vercel/client';
import { client } from '../../../mocks/client';
import deploy from '../../../../src/commands/deploy';
import { setupUnitFixture } from '../../../helpers/setup-unit-fixture';
import { defaultProject, useProject } from '../../../mocks/project';
import { useDeployment, useBuildLogs } from '../../../mocks/deployment';
import { useTeams } from '../../../mocks/team';
import { useUser } from '../../../mocks/user';
import humanizePath from '../../../../src/util/humanize-path';
import sleep from '../../../../src/util/sleep';

describe('deploy', () => {
  it('should reject deploying a single file', async () => {
    client.setArgv('deploy', __filename);
    const exitCodePromise = deploy(client);
    await expect(client.stderr).toOutput(
      `Error: Support for single file deployments has been removed.\nLearn More: https://vercel.link/no-single-file-deployments\n`
    );
    await expect(exitCodePromise).resolves.toEqual(1);
  });

  it('should reject deploying multiple files', async () => {
    client.setArgv('deploy', __filename, join(__dirname, 'inspect.test.ts'));
    const exitCodePromise = deploy(client);
    await expect(client.stderr).toOutput(
      `Error: Can't deploy more than one path.\n`
    );
    await expect(exitCodePromise).resolves.toEqual(1);
  });

  it('should reject deploying a directory that does not exist', async () => {
    const badName = 'does-not-exist';
    client.setArgv('deploy', badName);
    const exitCodePromise = deploy(client);
    await expect(client.stderr).toOutput(
      `Error: Could not find “${humanizePath(
        join(client.cwd, 'does-not-exist')
      )}”\n`
    );
    await expect(exitCodePromise).resolves.toEqual(1);
  });

  it('should reject deploying when `--prebuilt` is used and `vc build` failed before Builders', async () => {
    const cwd = setupUnitFixture('build-output-api-failed-before-builds');

    useUser();
    useTeams('team_dummy');
    useProject({
      ...defaultProject,
      id: 'build-output-api-failed-before-builds',
      name: 'build-output-api-failed-before-builds',
    });

    client.setArgv('deploy', cwd, '--prebuilt');
    const exitCodePromise = deploy(client);
    await expect(client.stderr).toOutput(
      '> Prebuilt deployment cannot be created because `vercel build` failed with error:\n\nError: The build failed (top-level)\n'
    );
    await expect(exitCodePromise).resolves.toEqual(1);
  });

  it('should reject deploying when `--prebuilt` is used and `vc build` failed within a Builder', async () => {
    const cwd = setupUnitFixture('build-output-api-failed-within-build');

    useUser();
    useTeams('team_dummy');
    useProject({
      ...defaultProject,
      id: 'build-output-api-failed-within-build',
      name: 'build-output-api-failed-within-build',
    });

    client.setArgv('deploy', cwd, '--prebuilt');
    const exitCodePromise = deploy(client);
    await expect(client.stderr).toOutput(
      '> Prebuilt deployment cannot be created because `vercel build` failed with error:\n\nError: The build failed within a Builder\n'
    );
    await expect(exitCodePromise).resolves.toEqual(1);
  });

  it('should reject deploying a directory that does not contain ".vercel/output" when `--prebuilt` is used', async () => {
    useUser();
    useTeams('team_dummy');
    useProject({
      ...defaultProject,
      name: 'static',
      id: 'static',
    });

    client.cwd = setupUnitFixture('commands/deploy/static');
    client.setArgv('deploy', '--prebuilt');
    const exitCodePromise = deploy(client);
    await expect(client.stderr).toOutput(
      'Error: The "--prebuilt" option was used, but no prebuilt output found in ".vercel/output". Run `vercel build` to generate a local build.\n'
    );
    await expect(exitCodePromise).resolves.toEqual(1);
  });

  it('should reject deploying a directory that was built with a different target environment when `--prebuilt --prod` is used on "preview" output', async () => {
    const cwd = setupUnitFixture('build-output-api-preview');

    useUser();
    useTeams('team_dummy');
    useProject({
      ...defaultProject,
      id: 'build-output-api-preview',
      name: 'build-output-api-preview',
    });

    client.setArgv('deploy', cwd, '--prebuilt', '--prod');
    const exitCodePromise = deploy(client);
    await expect(client.stderr).toOutput(
      'Error: The "--prebuilt" option was used with the target environment "production",' +
        ' but the prebuilt output found in ".vercel/output" was built with target environment "preview".' +
        ' Please run `vercel --prebuilt`.\n' +
        'Learn More: https://vercel.link/prebuilt-environment-mismatch\n'
    );
    await expect(exitCodePromise).resolves.toEqual(1);
  });

  it('should reject deploying a directory that was built with a different target environment when `--prebuilt` is used on "production" output', async () => {
    const cwd = setupUnitFixture('build-output-api-production');

    useUser();
    useTeams('team_dummy');
    useProject({
      ...defaultProject,
      id: 'build-output-api-production',
      name: 'build-output-api-production',
    });

    client.setArgv('deploy', cwd, '--prebuilt');
    const exitCodePromise = deploy(client);
    await expect(client.stderr).toOutput(
      'Error: The "--prebuilt" option was used with the target environment "preview",' +
        ' but the prebuilt output found in ".vercel/output" was built with target environment "production".' +
        ' Please run `vercel --prebuilt --prod`.\n' +
        'Learn More: https://vercel.link/prebuilt-environment-mismatch\n'
    );
    await expect(exitCodePromise).resolves.toEqual(1);
  });

  it('should reject deploying "version: 1"', async () => {
    client.setArgv('deploy');
    client.localConfig = {
      [fileNameSymbol]: 'vercel.json',
      version: 1,
    };
    const exitCodePromise = deploy(client);
    await expect(client.stderr).toOutput(
      'Error: The value of the `version` property within vercel.json can only be `2`.\n'
    );
    await expect(exitCodePromise).resolves.toEqual(1);
  });

  it('should reject deploying "version: {}"', async () => {
    client.setArgv('deploy');
    client.localConfig = {
      [fileNameSymbol]: 'vercel.json',
      // @ts-ignore
      version: {},
    };
    const exitCodePromise = deploy(client);
    await expect(client.stderr).toOutput(
      'Error: The `version` property inside your vercel.json file must be a number.\n'
    );
    await expect(exitCodePromise).resolves.toEqual(1);
  });

  it('should send a tgz file when `--archive=tgz`', async () => {
    const user = useUser();
    useTeams('team_dummy');
    useProject({
      ...defaultProject,
      name: 'static',
      id: 'static',
    });

    let body: any;
    client.scenario.post(`/v13/deployments`, (req, res) => {
      body = req.body;
      res.json({
        creator: {
          uid: user.id,
          username: user.username,
        },
        id: 'dpl_archive_test',
      });
    });
    client.scenario.get(`/v13/deployments/dpl_archive_test`, (req, res) => {
      res.json({
        creator: {
          uid: user.id,
          username: user.username,
        },
        id: 'dpl_archive_test',
        readyState: 'READY',
        aliasAssigned: true,
        alias: [],
      });
    });
    client.scenario.get(`/v10/now/deployments/dpl_archive_test`, (req, res) => {
      res.json({
        creator: {
          uid: user.id,
          username: user.username,
        },
        id: 'dpl_archive_test',
        readyState: 'READY',
        aliasAssigned: true,
        alias: [],
      });
    });

    client.cwd = setupUnitFixture('commands/deploy/static');
    client.setArgv('deploy', '--archive=tgz');
    const exitCode = await deploy(client);
    expect(exitCode).toEqual(0);
    expect(body?.files?.length).toEqual(1);
    expect(body?.files?.[0].file).toEqual('.vercel/source.tgz');
  });

  it('should pass flag to skip custom domain assignment', async () => {
    const user = useUser();
    useTeams('team_dummy');
    useProject({
      ...defaultProject,
      name: 'static',
      id: 'static',
    });

    let body: any;
    client.scenario.post(`/v13/deployments`, (req, res) => {
      body = req.body;
      res.json({
        creator: {
          uid: user.id,
          username: user.username,
        },
        id: 'dpl_archive_test',
      });
    });
    client.scenario.get(`/v13/deployments/dpl_archive_test`, (req, res) => {
      res.json({
        creator: {
          uid: user.id,
          username: user.username,
        },
        id: 'dpl_archive_test',
        readyState: 'READY',
        aliasAssigned: true,
        alias: [],
      });
    });

    client.cwd = setupUnitFixture('commands/deploy/static');
    client.setArgv('deploy', '--prod', '--skip-domain');
    const exitCode = await deploy(client);
    expect(exitCode).toEqual(0);
    expect(body).toMatchObject({
      target: 'production',
      source: 'cli',
      autoAssignCustomDomains: false,
      version: 2,
    });
  });

  it('should upload missing files', async () => {
    const cwd = setupUnitFixture('commands/deploy/static');
    client.cwd = cwd;

    // Add random 1mb file
    await fs.writeFile(join(cwd, 'data'), randomBytes(bytes('1mb')));

    const user = useUser();
    useTeams('team_dummy');
    useProject({
      ...defaultProject,
      name: 'static',
      id: 'static',
    });

    let body: any;
    let fileUploaded = false;
    client.scenario.post(`/v13/deployments`, (req, res) => {
      if (fileUploaded) {
        body = req.body;
        res.json({
          creator: {
            uid: user.id,
            username: user.username,
          },
          id: 'dpl_archive_test',
        });
      } else {
        const sha = req.body.files[0].sha;
        res.status(400).json({
          error: {
            code: 'missing_files',
            message: 'Missing files',
            missing: [sha],
          },
        });
      }
    });
    client.scenario.post('/v2/files', (req, res) => {
      // Wait for file to be finished uploading
      req.on('data', () => {
        // Noop
      });
      req.on('end', () => {
        fileUploaded = true;
        res.end();
      });
    });
    client.scenario.get(`/v13/deployments/dpl_archive_test`, (req, res) => {
      res.json({
        creator: {
          uid: user.id,
          username: user.username,
        },
        id: 'dpl_archive_test',
        readyState: 'READY',
        aliasAssigned: true,
        alias: [],
      });
    });
    client.scenario.get(`/v10/now/deployments/dpl_archive_test`, (req, res) => {
      res.json({
        creator: {
          uid: user.id,
          username: user.username,
        },
        id: 'dpl_archive_test',
        readyState: 'READY',
        aliasAssigned: true,
        alias: [],
      });
    });

    // When stderr is not a TTY we expect 5 progress lines to be printed
    client.stderr.isTTY = false;

    client.setArgv('deploy', '--archive=tgz');
    const uploadingLines: string[] = [];
    client.stderr.on('data', data => {
      if (data.startsWith('Uploading [')) {
        uploadingLines.push(data);
      }
    });
    client.stderr.resume();
    const exitCode = await deploy(client);
    expect(exitCode).toEqual(0);
    expect(body?.files?.length).toEqual(1);
    expect(body?.files?.[0].file).toEqual('.vercel/source.tgz');
    expect(uploadingLines.length).toEqual(5);
    expect(
      uploadingLines[0].startsWith('Uploading [--------------------]')
    ).toEqual(true);
    expect(
      uploadingLines[1].startsWith('Uploading [=====---------------]')
    ).toEqual(true);
    expect(
      uploadingLines[2].startsWith('Uploading [==========----------]')
    ).toEqual(true);
    expect(
      uploadingLines[3].startsWith('Uploading [===============-----]')
    ).toEqual(true);
    expect(
      uploadingLines[4].startsWith('Uploading [====================]')
    ).toEqual(true);
  });

  it('should deploy project linked with `repo.json`', async () => {
    const user = useUser();
    useTeams('team_dummy');
    useProject({
      ...defaultProject,
      name: 'app',
      id: 'QmbKpqpiUqbcke',
    });

    let body: any;
    client.scenario.post(`/v13/deployments`, (req, res) => {
      body = req.body;
      res.json({
        creator: {
          uid: user.id,
          username: user.username,
        },
        id: 'dpl_archive_test',
      });
    });
    client.scenario.get(`/v13/deployments/dpl_archive_test`, (req, res) => {
      res.json({
        creator: {
          uid: user.id,
          username: user.username,
        },
        id: 'dpl_archive_test',
        readyState: 'READY',
        aliasAssigned: true,
        alias: [],
      });
    });

    const repoRoot = setupUnitFixture('commands/deploy/monorepo-static');
    client.cwd = join(repoRoot, 'app');
    client.setArgv('deploy');
    const exitCode = await deploy(client);
    expect(exitCode).toEqual(0);
    expect(body).toMatchObject({
      source: 'cli',
      version: 2,
    });
  });

  it('should send `projectSettings.nodeVersion` based on `engines.node` package.json field', async () => {
    const user = useUser();
    useTeams('team_dummy');
    useProject({
      ...defaultProject,
      name: 'node',
      id: 'QmbKpqpiUqbcke',
    });

    let body: any;
    client.scenario.post(`/v13/deployments`, (req, res) => {
      body = req.body;
      res.json({
        creator: {
          uid: user.id,
          username: user.username,
        },
        id: 'dpl_',
      });
    });
    client.scenario.get(`/v13/deployments/dpl_`, (req, res) => {
      res.json({
        creator: {
          uid: user.id,
          username: user.username,
        },
        id: 'dpl_',
        readyState: 'READY',
        aliasAssigned: true,
        alias: [],
      });
    });

    const repoRoot = setupUnitFixture('commands/deploy/node');
    client.cwd = repoRoot;
    client.setArgv('deploy');
    const exitCode = await deploy(client);
    expect(exitCode).toEqual(0);
    expect(body).toMatchObject({
      source: 'cli',
      version: 2,
      projectSettings: {
        nodeVersion: '20.x',
        sourceFilesOutsideRootDirectory: true,
      },
    });
  });

  it('should send `projectSettings.nodeVersion` based on `engines.node` package.json field with `builds` in `vercel.json`', async () => {
    const user = useUser();
    useTeams('team_dummy');
    useProject({
      ...defaultProject,
      name: 'legacy-builds',
      id: 'QmbKpqpiUqbcke',
    });

    let body: any;
    client.scenario.post(`/v13/deployments`, (req, res) => {
      body = req.body;
      res.json({
        creator: {
          uid: user.id,
          username: user.username,
        },
        id: 'dpl_',
      });
    });
    client.scenario.get(`/v13/deployments/dpl_`, (req, res) => {
      res.json({
        creator: {
          uid: user.id,
          username: user.username,
        },
        id: 'dpl_',
        readyState: 'READY',
        aliasAssigned: true,
        alias: [],
      });
    });

    const repoRoot = setupUnitFixture('commands/deploy/legacy-builds');
    client.cwd = repoRoot;
    client.setArgv('deploy');
    const exitCode = await deploy(client);
    expect(exitCode).toEqual(0);
    expect(body).toMatchObject({
      source: 'cli',
      version: 2,
      projectSettings: {
        nodeVersion: '18.x',
        sourceFilesOutsideRootDirectory: true,
      },
    });
  });

  it('should send latest supported node version when given a >low-node-version based on `engines.node` package.json field', async () => {
    const user = useUser();
    useTeams('team_dummy');
    useProject({
      ...defaultProject,
      name: 'node-low-starting-range',
      id: 'QmbKpqpiUqbcke',
    });

    let body: any;
    client.scenario.post(`/v13/deployments`, (req, res) => {
      body = req.body;
      res.json({
        creator: {
          uid: user.id,
          username: user.username,
        },
        id: 'dpl_',
      });
    });
    client.scenario.get(`/v13/deployments/dpl_`, (req, res) => {
      res.json({
        creator: {
          uid: user.id,
          username: user.username,
        },
        id: 'dpl_',
        readyState: 'READY',
        aliasAssigned: true,
        alias: [],
      });
    });

    const repoRoot = setupUnitFixture(
      'commands/deploy/node-low-starting-range'
    );
    client.cwd = repoRoot;
    client.setArgv('deploy');
    const exitCode = await deploy(client);
    expect(exitCode).toEqual(0);
    expect(body).toMatchObject({
      source: 'cli',
      version: 2,
      projectSettings: {
        nodeVersion: '20.x',
        sourceFilesOutsideRootDirectory: true,
      },
    });
  });

  it('should send no version when `engines.node` package.json field is fixed to an outdated version', async () => {
    const user = useUser();
    useTeams('team_dummy');
    useProject({
      ...defaultProject,
      name: 'node-low-version',
      id: 'QmbKpqpiUqbcke',
    });

    let body: any;
    client.scenario.post(`/v13/deployments`, (req, res) => {
      body = req.body;
      res.json({
        creator: {
          uid: user.id,
          username: user.username,
        },
        id: 'dpl_',
      });
    });
    client.scenario.get(`/v13/deployments/dpl_`, (req, res) => {
      res.json({
        creator: {
          uid: user.id,
          username: user.username,
        },
        id: 'dpl_',
        readyState: 'READY',
        aliasAssigned: true,
        alias: [],
      });
    });

    const repoRoot = setupUnitFixture('commands/deploy/node-low-version');
    client.cwd = repoRoot;
    client.setArgv('deploy');
    const exitCodePromise = deploy(client);
    await expect(client.stderr).toOutput(
      'WARN! Node.js Version "10.x" is discontinued and must be upgraded. Please set "engines": { "node": "20.x" } in your `package.json` file to use Node.js 20.'
    );
    await expect(exitCodePromise).resolves.toEqual(0);
    expect(body).toMatchObject({
      source: 'cli',
      version: 2,
      projectSettings: {
        sourceFilesOutsideRootDirectory: true,
      },
    });
  });

  it('should print and follow build logs while deploying', async () => {
    const user = useUser();
    useTeams('team_dummy');
    useProject({
      ...defaultProject,
      name: 'node',
      id: 'QmbKpqpiUqbcke',
    });
    const deployment = useDeployment({ creator: user, state: 'BUILDING' });
    deployment.aliasAssigned = false;
    client.scenario.post(`/v13/deployments`, (req, res) => {
      res.json(
        res.json({
          creator: {
            uid: user.id,
            username: user.username,
          },
          id: deployment.id,
          readyState: deployment.readyState,
          aliasAssigned: false,
          alias: [],
        })
      );
    });
    useBuildLogs({
      deployment,
      logProducer: async function* () {
        yield { created: 1717426870339, text: 'Hello, world!' };
        await sleep(100);
        yield { created: 1717426870439, text: 'slow...' };
        await sleep(100);
        yield { created: 1717426870540, text: 'Bye...' };
      },
    });

    let exitCode: number;
    const runCommand = async () => {
      const repoRoot = setupUnitFixture('commands/deploy/node');
      client.cwd = repoRoot;
      client.setArgv('deploy', '--logs');
      exitCode = await deploy(client);
    };

    const slowlyDeploy = async () => {
      await sleep(500);
      deployment.readyState = 'READY';
      deployment.aliasAssigned = true;
    };

    await Promise.all<void>([runCommand(), slowlyDeploy()]);

    // remove first 4 lines which contains randomized data
    expect(client.getFullOutput().split('\n').slice(4).join('\n'))
      .toMatchInlineSnapshot(`
        "Building
        2024-06-03T15:01:10.339Z  Hello, world!
        2024-06-03T15:01:10.439Z  slow...
        2024-06-03T15:01:10.540Z  Bye...
        "
      `);
    expect(exitCode).toEqual(0);
  });

  describe.todo('[project-path]');
  describe.todo('--force');
  describe.todo('--with-cache');
  describe.todo('--public');
  describe.todo('--env');
  describe.todo('--build-env');
  describe.todo('--meta');
  describe.todo('--regions');
  describe.todo('--prebuilt');
  describe.todo('--archive');
  describe.todo('--no-wait');
  describe.todo('--skip-domain');
  describe.todo('--yes');
  describe.todo('--logs');
  describe.todo('--name');
  describe.todo('--no-clipboard');
  describe.todo('--target');
  describe.todo('--confirm');
});
