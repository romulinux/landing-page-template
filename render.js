const nunjucks = require('nunjucks');
const fs = require('fs');

// Configura a pasta raiz onde ficarão os arquivos .njk ou .html
nunjucks.configure('.', {
  autoescape: true
});

try {
  const config = JSON.parse(fs.readFileSync('site-config.json', 'utf-8'));

  const date = new Date();
  const data = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');

  config.lastmod = data;
  config.year = date.getFullYear();

  const files = [
    { template: 'index.njk', output: 'index.html' },
    { template: 'sitemap.njk', output: 'sitemap.xml' },
    { template: 'robots.njk', output: 'robots.txt' }
  ];

  for (const file of files) {
    nunjucks.render(file.template, { config }, function (err, res) {
      if (err) {
        console.error('Erro ao renderizar o template:', err);
        return;
      }

      fs.writeFileSync(file.output, res, 'utf-8');
    });
  }

} catch (error) {
  console.error('Erro ao ler o arquivo de configuração:', error);
}

