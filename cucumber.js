// cucumber.js

export default {
  default: {
    require: [
      'tests/steps/**/*.ts'
    ],
    requireModule: ['ts-node/esm'],
    format: [
      'progress-bar',
      'html:cucumber-report.html',
      'json:cucumber-report.json'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    parallel: 1,
    strict: true,
    dryRun: false,
    failFast: false,
    paths: ['tests/features/**/*.feature']
  },
  criacao: {
    require: [
      'tests/steps/**/*.ts'
    ],
    requireModule: ['ts-node/esm'],
    format: [
      'progress-bar',
      'html:cucumber-report-criacao.html',
      'json:cucumber-report-criacao.json'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    parallel: 1,
    strict: true,
    dryRun: false,
    failFast: false,
    paths: ['tests/features/alunos-criacao.feature'],
    tags: '@criacao'
  }
};
