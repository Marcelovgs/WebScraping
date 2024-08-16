const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const axios = require('axios');

puppeteer.use(StealthPlugin());

const items = [
  { url: 'https://www.historyreborn.net/?module=item&action=view&id=27125', valorMedio: 4000 },
  { url: 'https://www.historyreborn.net/?module=item&action=view&id=27262', valorMedio: 60000 },
  { url: 'https://www.historyreborn.net/?module=item&action=view&id=420199', valorMedio: 400000 },
  { url: 'https://www.historyreborn.net/?module=item&action=view&id=4658', valorMedio: 5000 }
];

// Substitua pelo URL do webhook que você criou no Discord
const discordWebhookUrl = 'https://discord.com/api/webhooks/1274046922117873715/JlqoiBbCyoGduv9Xy1E-gQR689FGAj9Bm2IQzD9tAvnOner2hTnh9A64EuJCl9iXSfGS';

// Função para converter valores abreviados, como "k" e "M"
function convertAbbreviatedValue(valueStr) {
  let value = valueStr.replace(/[.,]/g, '').toLowerCase(); // Remove pontos, vírgulas e converte para minúsculas
  if (value.includes('m')) {
    return parseInt(value.replace('m', '')) * 1000000;
  } else if (value.includes('k')) {
    return parseInt(value.replace('k', '')) * 1000;
  }
  return parseInt(value); // Valor sem abreviação
}

// Função para formatar valores com vírgulas (exemplo: 1,000,000)
function formatWithCommas(value) {
  return value.toLocaleString('en-US'); // Formata o número com vírgulas
}

// Função para enviar a notificação para o Discord
async function sendDiscordNotification(item, loja, valor) {
  const message = {
    content: `🟢 O item foi encontrado com valor menor que o valor médio! @here\n**Item:** ${item.url}\n**Loja:** ${loja}\n**Valor:** ${valor}c`,
  };

  try {
    await axios.post(discordWebhookUrl, message);
    console.log('Notificação enviada para o Discord com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar notificação para o Discord:', error.message);
  }
}

// Função principal que executa o scraping usando Puppeteer
async function scrapeItem(item) {
  const { url, valorMedio } = item;

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    console.log(`\nAnalisando item na URL: ${url}`);
    console.log(`Valor médio definido para este item: ${formatWithCommas(valorMedio)}c`);

    // Extraindo diretamente as linhas da tabela usando o Puppeteer
    const vendas = await page.evaluate(() => {
      const linhas = Array.from(document.querySelectorAll('#nova-sale-table tbody tr'));
      return linhas.map((linha) => {
        const loja = linha.querySelector('td').innerText.trim();
        const valorStr = linha.querySelectorAll('td')[3]?.innerText.trim(); // Valor do item, com verificação de segurança
        return { loja, valorStr };
      });
    });

    // Verifica se há vendas disponíveis
    if (vendas.length === 0) {
      console.log("Nenhuma venda encontrada.");
    } else {
      // Processa cada venda
      vendas.forEach(venda => {
        if (!venda.valorStr || isNaN(convertAbbreviatedValue(venda.valorStr))) {
          console.log(`Loja: ${venda.loja} - Valor inválido: ${venda.valorStr}`);
        } else {
          const valor = convertAbbreviatedValue(venda.valorStr); // Converte o valor formatado
          if (valor < valorMedio) {
            console.log(`Loja: ${venda.loja} - Valor: ${formatWithCommas(valor)}c (abaixo do valor médio de ${formatWithCommas(valorMedio)}c)`);
            // Enviar notificação para o Discord
            sendDiscordNotification(item, venda.loja, formatWithCommas(valor));
          } else {
            console.log(`Loja: ${venda.loja} - Valor: ${formatWithCommas(valor)}c (acima do valor médio)`);
          }
        }
      });
    }

    await browser.close();
  } catch (error) {
    console.error(`Erro ao acessar a URL: ${url}`, error.message);
  }
}

// Função para processar todos os itens
function processarItens() {
  items.forEach(scrapeItem);
}

// Função para iniciar o scraping a cada 2 minutos
function iniciarScraping() {
  // Chama a função para processar os itens imediatamente
  processarItens();

  // Define o intervalo para repetir o scraping a cada 2 minutos (120000ms)
  setInterval(() => {
    console.log('Executando o scraping novamente...');
    processarItens();
  }, 120000); // Intervalo em milissegundos (2 minutos = 120000ms)
}

// Chama a função para iniciar o scraping contínuo
iniciarScraping();
