const path = require('path');
const angularConfig = require('./angular.json');

const excludingE2E = Object.keys(angularConfig.projects)
  .map(key => ({ ...angularConfig.projects[key], id: key }))
  .filter(project => !project.id.includes('-e2e'));

const onlyJest = excludingE2E.filter(project => project.architect.test.builder.includes('jest'));

const filesBlueprints = [
  {
    prefix: '',
    postfix: '**/*.+(ts|html|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)'
  },
  { prefix: '!', postfix: '**/*.spec.ts' }
];

const files = onlyJest.reduce(
  (accumulator, project) => [
    ...accumulator,
    ...filesBlueprints.map(blueprint => blueprint.prefix + path.join(project.sourceRoot, blueprint.postfix))
  ],
  ['test-setup.ts', 'tsconfig.json', 'tsconfig.spec.json', 'jest.config.js']
);

const tests = [...onlyJest.map(({ sourceRoot }) => path.join(sourceRoot, '**/*.spec.ts')), '!apps/*-e2e/**/*.spec.ts'];

const ngxWallabyJest = require('ngx-wallaby-jest');

module.exports = function(wallaby) {
  return {
    files,

    tests,

    env: {
      type: 'node',
      runner: 'node'
    },

    compilers: {
      '**/*.ts?(x)': wallaby.compilers.typeScript({ module: 'commonjs' })
    },

    preprocessors: {
      // This translate templateUrl and styleUrls to the right implementation
      // For wallaby
      'apps/**/*.component.ts': ngxWallabyJest,
      'libs/**/*.component.ts': ngxWallabyJest
    },

    testFramework: 'jest',

    setup: function(wallaby) {
      var jestConfig = require('./jest.config');
      delete jestConfig.passWithNoTests;
      jestConfig.setupFilesAfterEnv = ['<rootDir>/apps/todos/src/test-setup.ts'];

      jestConfig.moduleNameMapper = {
        'test/(.*)': `${wallaby.localProjectDir}test/$1`,
        '@env/(.*)': `${wallaby.localProjectDir}apps/webshop/src/environments/$1`,
        //'@wallaby2190/ui': `${wallaby.projectCacheDir}libs/ui/src/index.ts`,
      };

      wallaby.testFramework.configure(jestConfig);
    }
  };
};
