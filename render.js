const nunjucks = require('nunjucks');
const fs = require('fs');

// Configura a pasta raiz onde ficarão os arquivos .njk ou .html
nunjucks.configure('.', {
  autoescape: true
});

try {
  const config = JSON.parse(fs.readFileSync('site-config.json', 'utf-8'));

  nunjucks.render('index.njk', { config }, function (err, res) {
    if (err) {
      console.error('Erro ao renderizar o template:', err);
      return;
    }

    fs.writeFileSync('index.html', res, 'utf-8');
  });
} catch (error) {
  console.error('Erro ao ler o arquivo de configuração:', error);
}

