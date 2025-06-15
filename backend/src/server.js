require('module-alias/register');
const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');
const fs = require('fs');

// Verifica versão do Node
const [major] = process.versions.node.split('.').map(Number);
if (major < 20) {
  console.log('Please upgrade your node.js version to at least 20 or greater. 👌\n ');
  process.exit();
}

// Carrega variáveis de ambiente
const envLocalPath = path.resolve(__dirname, '../.env.local');
const envPath = path.resolve(__dirname, '../.env');

if (fs.existsSync(envLocalPath)) {
  require('dotenv').config({ path: envLocalPath });
} else {
  require('dotenv').config({ path: envPath });
}

// Conecta ao MongoDB
mongoose.connect(process.env.DATABASE);

mongoose.connection.on('error', (error) => {
  console.log(
    `1. 🔥 Common Error caused issue → Check your .env file first and add your MongoDB URL`
  );
  console.error(`2. 🚫 Error → : ${error.message}`);
});

// Carrega todos os models
const modelsFiles = globSync('./src/models/**/*.js');
for (const filePath of modelsFiles) {
  require(path.resolve(filePath));
}

console.log('Current working directory:', process.cwd());
console.log('models found:', modelsFiles);

// Start do App
const app = require('./app');
app.set('port', process.env.PORT || 3000);

const PORT = app.get('port') || 8888;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Express rodando na porta: ${PORT}`);
});
