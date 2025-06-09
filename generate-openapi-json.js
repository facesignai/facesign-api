#!/usr/bin/env node

const fs = require('fs')
const yaml = require('js-yaml')

try {
  // Read the YAML file
  const yamlContent = fs.readFileSync('./openapi.yaml', 'utf8')
  
  // Convert to JavaScript object
  const openApiSpec = yaml.load(yamlContent)
  
  // Write as JSON
  fs.writeFileSync('./openapi.json', JSON.stringify(openApiSpec, null, 2))
  
  console.log('✅ Successfully generated openapi.json from openapi.yaml')
} catch (error) {
  console.error('❌ Error converting OpenAPI spec:', error.message)
  process.exit(1)
} 