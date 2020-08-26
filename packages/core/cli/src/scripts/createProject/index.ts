import path from 'path';
import log from '../../utils/log';
import copyIntegrationTheme from './copyIntegrationTheme';
import copyAgnosticTheme from './copyAgnosticTheme';
import processMagicComments from './processMagicComments';
import updatePackageJson from './updatePackageJson';

const getProjectDirectoryName = (targetPath: string): string => targetPath.split('/').pop();

async function createProject(integration: string, targetPath: string): Promise<void> {

  log.info(`Coppying ${integration}-theme to ${targetPath}`);
  await copyIntegrationTheme(integration, targetPath, ['_theme', '.nuxt', 'node_modules']);

  log.info(`Coppying agnostic theme to ${targetPath}`);
  await copyAgnosticTheme(integration, targetPath);

  log.info('Updating Nuxt config');
  const absoluteTargetPath = path.isAbsolute(targetPath)
    ? targetPath
    : path.join(__dirname, targetPath);
  const nuxtConfigPath = path.join(absoluteTargetPath, 'nuxt.config.js');
  await processMagicComments(nuxtConfigPath);

  const packageJsonPath = path.join(absoluteTargetPath, 'package.json');
  await updatePackageJson(packageJsonPath, getProjectDirectoryName(targetPath));
}

export default createProject;
