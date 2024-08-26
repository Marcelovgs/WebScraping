const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { Client, GatewayIntentBits } = require('discord.js');

// Configuração do Discord.js
const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages]});
const discordToken = 'MTI3NDY3MzUyMjI2NTk0ODE3MA.GwQqZh.AjCuzfuvDUvgWZnIQR5pTP1dW51OdDCKxZrYwg'; // Substitua pelo token do seu bot
const userId = '178921387698683904'; // Substitua pelo ID do usuário que receberá as mensagens

puppeteer.use(StealthPlugin());

const BASE_URL = 'https://www.historyreborn.net/?module=item&action=view&id=';

const items = [
  { url: BASE_URL + '27262', valorMedio: 60000, nome: 'Carta Atria' },
  { url: BASE_URL + '420199', valorMedio: 450000, nome: 'Ghost Fire' },
  { url: BASE_URL + '540048', valorMedio: 70000, nome: 'One Sky One Sun-LT' },
  { url: BASE_URL + '490243', valorMedio: 40001, nome: 'Ring of Silver Claw' }, //muito disputado
  { url: BASE_URL + '300218', valorMedio: 2000, nome: 'Ashhopper Card' },
  { url: BASE_URL + '29509', valorMedio: 700000, nome: 'Hero' },
  { url: BASE_URL + '312475', valorMedio: 1000000, nome: 'Fury' },
  { url: BASE_URL + '29436', valorMedio: 2000000, nome: 'Dynast' },
  { url: BASE_URL + '17043', valorMedio: 4000, nome: 'Cx Perg Efeito: Golem' },
  { url: BASE_URL + '470254', valorMedio: 70000, nome: 'Calçados de Zen Ichinyo' },//valor zoado (valor adicionado do item +0)
  { url: BASE_URL + '490290', valorMedio: 300000, nome: 'Ameretat' }, //depende do enchant
  { url: BASE_URL + '490207', valorMedio: 4000000, nome: 'Memento Mori' }, //unica venda a 4.5kk
  { url: BASE_URL + '4496', valorMedio: 1800000, nome: 'Carta Drake Selada' },
  { url: BASE_URL + '540056', valorMedio: 600000, nome: 'Dim Glacier Book' },
  { url: BASE_URL + '27125', valorMedio: 4000, nome: 'Carta Mula Sem Cabeça' },
  { url: BASE_URL + '4658', valorMedio: 2500, nome: 'Carta Verit Pesadelo' },
  { url: BASE_URL + '33362', valorMedio: 20000, nome: 'Mini-Refinadora' },
  { url: BASE_URL + '33360', valorMedio: 140000, nome: 'Refinadora Complexa' },
  { url: BASE_URL + '24667', valorMedio: 140000, nome: 'Armadura Da Tormenta' },
  { url: BASE_URL + '410176', valorMedio: 55000, nome: 'Fones de Ouvido da Bruxa' },
  { url: BASE_URL + '24666', valorMedio: 140000, nome: 'Sapatos Sombrios da Tormenta' },
  { url: BASE_URL + '410216', valorMedio: 105000, nome: 'Orelhas do Abismo' },
  { url: BASE_URL + '410130', valorMedio: 110000, nome: 'Orelhas Fantasmagóricas' },
  { url: BASE_URL + '4486', valorMedio: 25000, nome: 'Carta Belzebu Selada' },
  { url: BASE_URL + '4498', valorMedio: 10000, nome: 'Carta Lady Tanee Selada' },
  { url: BASE_URL + '4624', valorMedio: 45000, nome: 'Carta Tao Gunka Selada ' },
  { url: BASE_URL + '4538', valorMedio: 4000, nome: 'Sealed White Lady Card' },
  { url: BASE_URL + '27211', valorMedio: 5000, nome: 'Sealed Baphomet Card' },
  { url: BASE_URL + '4490', valorMedio: 1000, nome: 'Sealed Moonlight Flower Card' },
  { url: BASE_URL + '4578', valorMedio: 6000, nome: 'Carta Pyuriel Furiosa' },
  { url: BASE_URL + '27221', valorMedio: 35000, nome: 'Sealed Gioia Card' },
  { url: BASE_URL + '480198', valorMedio: 20000, nome: 'Asas de Louro' },
  { url: BASE_URL + '38075', valorMedio: 3, nome: '[Hard] Moeda de Cheffênia' },
  { url: BASE_URL + '38071', valorMedio: 3, nome: '[Hard] Cristal de Bio 5' },
  

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
