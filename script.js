const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { Client, GatewayIntentBits } = require('discord.js');

// Configuração do Discord.js
const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages]});
const discordToken = ''; // Substitua pelo token do seu bot
const userId = ''; // Substitua pelo ID do usuário que receberá as mensagens

puppeteer.use(StealthPlugin());

const items = [
  { url: 'https://www.historyreborn.net/?module=item&action=view&id=27262', valorMedio: 60000, nome: 'Carta Atria' },
  { url: 'https://www.historyreborn.net/?module=item&action=view&id=420199', valorMedio: 450000, nome: 'Ghost Fire' },
  { url: 'https://www.historyreborn.net/?module=item&action=view&id=540048', valorMedio: 70000, nome: 'One Sky One Sun-LT' },
  { url: 'https://www.historyreborn.net/?module=item&action=view&id=490243', valorMedio: 40001, nome: 'Ring of Silver Claw' },
  // Outros itens...
];

// Função para converter valores abreviados, como "k" e "M"
function convertAbbreviatedValue(valueStr) {
  let value = valueStr.toLowerCase().replace(/[^\dkm,.]/g, ''); 

  let numericValue;
  if (value.includes('m')) {
    numericValue = parseFloat(value.replace('m', '').replace(',', '')) * 1000000;
  } else if (value.includes('k')) {
    numericValue = parseFloat(value.replace('k', '').replace(',', '')) * 1000;
  } else {
    numericValue = parseFloat(value.replace(/[,.]/g, '')); 
  }
  
  return numericValue;
}

// Função para formatar valores com vírgulas (exemplo: 1,000,000)
function formatWithCommas(value) {
  return value.toLocaleString('en-US');
}

// Função para adicionar um atraso (em milissegundos)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para enviar a notificação para o usuário no Discord
async function sendDiscordNotification(item, loja, valor, imageUrl, itemUrl) {
  try {
    const user = await client.users.fetch(userId); // Obtém o usuário pelo ID
    const message = `🟢 O item foi encontrado com valor menor que o valor médio!\n**Item:** ${item.nome}\n**Loja:** ${loja}\n**Valor:** ${valor}c\n[Link para a loja](${itemUrl})`; // Inclui o link da loja

    // Envia a mensagem privada ao usuário
    await user.send({
      content: message,
      embeds: [
        {
          title: item.nome,  
          image: { url: imageUrl }, 
        },
      ],
    });
    console.log('Notificação enviada para o usuário com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar notificação para o usuário:', error.message);
  }
}

// Função principal que executa o scraping usando Puppeteer
async function scrapeItem(item, browser) {
  const { url, valorMedio } = item;

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    console.log(`\nAnalisando item na URL: ${url}`);
    console.log(`Valor médio definido para este item: ${formatWithCommas(valorMedio)}c`);

    const vendas = await page.evaluate(() => {
      const linhas = Array.from(document.querySelectorAll('#nova-sale-table tbody tr'));
      return linhas.map((linha) => {
        const loja = linha.querySelector('td').innerText.trim();
        const valorStr = linha.querySelectorAll('td')[3]?.innerText.trim();
        return { loja, valorStr };
      });
    });

    const imageUrl = await page.evaluate(() => {
      const imgElement = document.querySelector('div.novacard-box img');
      return imgElement ? imgElement.src : null; 
    });

    if (imageUrl) {
      console.log(`Imagem encontrada: ${imageUrl}`);
    } else {
      console.log('Nenhuma imagem encontrada no div.novacard-box.');
    }

    if (vendas.length === 0) {
      console.log("Nenhuma venda encontrada.");
    } else {
      for (const venda of vendas) {
        if (venda.loja.toLowerCase().includes("moeda de rmt")) {
          console.log(`Loja ignorada: ${venda.loja} - Vendendo por Moeda de RMT`);
          continue;
        }

        const valor = convertAbbreviatedValue(venda.valorStr); 

        if (!isNaN(valor) && valor < valorMedio) {
          console.log(`Loja: ${venda.loja} - Valor: ${formatWithCommas(valor)}c (abaixo do valor médio de ${formatWithCommas(valorMedio)}c)`);
          await sendDiscordNotification(item, venda.loja, formatWithCommas(valor), imageUrl, url); 
          await delay(2000); 
        } else {
          console.log(`Loja: ${venda.loja} - Valor: ${formatWithCommas(valor)}c (acima do valor médio)`);
        }
      }
    }

    await page.close();
  } catch (error) {
    console.error(`Erro ao acessar a URL: ${url}`, error.message);
  }
}

// Função que processa todos os itens de forma paralela
async function processarItens() {
  const browser = await puppeteer.launch({ headless: true }); 
  await Promise.all(items.map(item => scrapeItem(item, browser))); 
  await browser.close(); 
}

function iniciarScraping() {
  processarItens();
  setInterval(() => {
    console.log('Executando o scraping novamente...');
    processarItens();
  }, 120000); 
}

client.once('ready', () => {
  console.log('Bot pronto e conectado!');
  iniciarScraping();
});

client.login(discordToken);
