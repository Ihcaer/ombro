import { defineConfig } from 'orval';

export default defineConfig({
  mainApi: {
    input: { target: '../../../../../../contracts/swagger.json' },
    output: {
      mode: 'tags-split',
      workspace: 'src/lib/generated',
      target: 'endpoints',
      schemas: 'models',
      client: 'angular',
      httpClient: 'angular',
      clean: true,
      formatter: 'prettier',
      override: {
        useTypeOverInterfaces: true,
        enumGenerationType: 'union',
        operationName(operation, route, verb) {
          if (operation.operationId) {
            return operation.operationId.split('_').pop() || operation.operationId;
          } else {
            return operation.operationId;
          }
        },
      },
    },
  },
});
