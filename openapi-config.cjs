const config = {
  schemaFile: 'http://localhost:8001/api',
  apiFile: './src/store/baseApi.ts',
  apiImport: 'api',
  outputFile: './src/store/apis/apis.ts',
  exportName: 'openApi',
  hooks: true,
}

module.exports = config
