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
  { url: BASE_URL + '27262', valorMedio: 60000, nome: 'Carta Atria', id: '27262' },
  { url: BASE_URL + '420199', valorMedio: 1000000, nome: 'Ghost Fire', id: '420199' },
  { url: BASE_URL + '540048', valorMedio: 70000, nome: 'One Sky One Sun-LT', id: '540048' },
  { url: BASE_URL + '490243', valorMedio: 30000, nome: 'Ring of Silver Claw', id: '490243' }, //muito disputado
  { url: BASE_URL + '300218', valorMedio: 2000, nome: 'Ashhopper Card', id: '300218' },
  { url: BASE_URL + '29509', valorMedio: 700000, nome: 'Hero', id: '29509' },
  { url: BASE_URL + '312475', valorMedio: 1000000, nome: 'Fury', id: '312475' },
  { url: BASE_URL + '29436', valorMedio: 2000000, nome: 'Dynast', id: '29436' },
  { url: BASE_URL + '17043', valorMedio: 4000, nome: 'Cx Perg Efeito: Golem', id: '17043' },
  { url: BASE_URL + '470254', valorMedio: 70000, nome: 'Calçados de Zen Ichinyo', id: '470254' },//valor zoado (valor adicionado do item +0)
  { url: BASE_URL + '490290', valorMedio: 300000, nome: 'Ameretat', id: '490290' }, //depende do enchant
  { url: BASE_URL + '490207', valorMedio: 4000000, nome: 'Memento Mori', id: '490207' }, //unica venda a 4.5kk
  { url: BASE_URL + '4496', valorMedio: 1500000, nome: 'Carta Drake Selada', id: '4496' },
  { url: BASE_URL + '540056', valorMedio: 310000, nome: 'Dim Glacier Book', id: '540056' },
  { url: BASE_URL + '27125', valorMedio: 3000, nome: 'Carta Mula Sem Cabeça', id: '27125' },
  { url: BASE_URL + '4658', valorMedio: 2500, nome: 'Carta Verit Pesadelo', id: '4658' },
  { url: BASE_URL + '33362', valorMedio: 20000, nome: 'Mini-Refinadora', id: '33362' },
  { url: BASE_URL + '33360', valorMedio: 130000, nome: 'Refinadora Complexa', id: '33360' },
  { url: BASE_URL + '410176', valorMedio: 55000, nome: 'Fones de Ouvido da Bruxa', id: '410176' },
  { url: BASE_URL + '410216', valorMedio: 105000, nome: 'Orelhas do Abismo', id: '410216' },
  { url: BASE_URL + '410130', valorMedio: 110000, nome: 'Orelhas Fantasmagóricas', id: '410130' },
  { url: BASE_URL + '4486', valorMedio: 25000, nome: 'Carta Belzebu Selada', id: '4486' },
  { url: BASE_URL + '4498', valorMedio: 10000, nome: 'Carta Lady Tanee Selada', id: '4498' },
  { url: BASE_URL + '4624', valorMedio: 45000, nome: 'Carta Tao Gunka Selada ', id: '4624' },
  { url: BASE_URL + '4538', valorMedio: 4000, nome: 'Sealed White Lady Card', id: '4538' },
  { url: BASE_URL + '4490', valorMedio: 1000, nome: 'Sealed Moonlight Flower Card', id: '4490' },
  { url: BASE_URL + '4578', valorMedio: 6000, nome: 'Carta Pyuriel Furiosa', id: '4578' },
  { url: BASE_URL + '27221', valorMedio: 35000, nome: 'Sealed Gioia Card', id: '27221' },
  { url: BASE_URL + '480198', valorMedio: 10000, nome: 'Asas de Louro', id: '480198' },
  { url: BASE_URL + '38075', valorMedio: 3, nome: '[Hard] Moeda de Cheffênia', id: '38075' },
  { url: BASE_URL + '9248', valorMedio: 20000, nome: 'Ovo de Leão da Montanha', id: '9248' },
  { url: BASE_URL + '9251', valorMedio: 20000, nome: 'Ovo de Piamette', id: '9251' },
  { url: BASE_URL + '9254', valorMedio: 20000, nome: 'Ovo de Buwaya', id: '9254' },
  { url: BASE_URL + '9261', valorMedio: 20000, nome: 'Ovo de Elena Bolkova', id: '9261' },
  { url: BASE_URL + '9269', valorMedio: 30000, nome: 'Ovo de Brinaranea', id: '9269' },
  { url: BASE_URL + '9272', valorMedio: 20000, nome: 'Ovo de Echidna', id: '9272' },
  { url: BASE_URL + '9276', valorMedio: 20000, nome: 'Ovo de Aries', id: '9276' },
  { url: BASE_URL + '9286', valorMedio: 20000, nome: 'Ovo de Lapis Lazuli', id: '9286' },
  { url: BASE_URL + '9301', valorMedio: 20000, nome: 'Ovo de Fulgor', id: '9301' },
  { url: BASE_URL + '9256', valorMedio: 250000, nome: 'Ovo de Sakray', id: '9256' },
  { url: BASE_URL + '9257', valorMedio: 250000, nome: 'Ovo de Ceifador Ankou', id: '9257' },
  { url: BASE_URL + '9258', valorMedio: 250000, nome: 'Ovo de Sara Irine', id: '9258' },
  { url: BASE_URL + '9259', valorMedio: 250000, nome: 'Ovo de Death Witch', id: '9259' },
  { url: BASE_URL + '9246', valorMedio: 250000, nome: 'Ovo de Deus Morroc', id: '9246' },
  { url: BASE_URL + '9250', valorMedio: 250000, nome: 'Ovo de Betelgeuse', id: '9250' },
  { url: BASE_URL + '9253', valorMedio: 250000, nome: 'Ovo de Freyja', id: '9253' },
  { url: BASE_URL + '9260', valorMedio: 250000, nome: 'Ovo de Malícia', id: '9260' },
  { url: BASE_URL + '9268', valorMedio: 250000, nome: 'Ovo de Corrupted Dark Lord', id: '9268' },
  { url: BASE_URL + '9271', valorMedio: 250000, nome: 'Ovo de Pássaro Elemental', id: '9271' },
  { url: BASE_URL + '9275', valorMedio: 250000, nome: 'Ovo de Reencarnação de Morroc', id: '9275' },
  { url: BASE_URL + '9294', valorMedio: 25000, nome: 'Ovo de Titã de Gelo', id: '9294' },
  { url: BASE_URL + '450242', valorMedio: 1000000, nome: 'Robe Elemental', id: '450242' },
  { url: BASE_URL + '44450', valorMedio: 250000, nome: 'Espírito de Nebula', id: '44450' },
  { url: BASE_URL + '310321', valorMedio: 200000, nome: 'Abyssal King', id: '310321' },
  { url: BASE_URL + '410028', valorMedio: 300000, nome: 'Cesta das Maravilhas', id: '410028' },
  { url: BASE_URL + '4480', valorMedio: 50000, nome: 'Carta Kiel Selada', id: '4480' },
  { url: BASE_URL + '300166', valorMedio: 180000, nome: 'Reversed The Moon Card', id: '300166' },
  { url: BASE_URL + '4374', valorMedio: 20000, nome: 'Carta Vesper', id: '4374' },
  { url: BASE_URL + '4652', valorMedio: 900000, nome: 'Carta Amon Ra do Pesadelo', id: '4652' },
  { url: BASE_URL + '4561', valorMedio: 25000, nome: 'Carta Professora Celia', id: '4561' },
  { url: BASE_URL + '4576', valorMedio: 15000, nome: 'Carta Feiticeira Celia', id: '4576' },
  { url: BASE_URL + '4576', valorMedio: 1000000, nome: 'Carta Gioia', id: '4576' },
  { url: BASE_URL + '300079', valorMedio: 70000, nome: 'Red Pepper Card', id: '300079' },
  { url: BASE_URL + '4539', valorMedio: 5000, nome: 'Carta Bispo Decadente Selada', id: '4539' },
  { url: BASE_URL + '4577', valorMedio: 10000, nome: 'Carta Elvira', id: '4577' },
  { url: BASE_URL + '4876', valorMedio: 800000, nome: 'Epifania', id: '4876' },
  { url: BASE_URL + '4148', valorMedio: 800000, nome: 'Carta Faraó', id: '4148' },
  { url: BASE_URL + '29585', valorMedio: 800000, nome: 'Arcana', id: '29585' },
  { url: BASE_URL + '300227', valorMedio: 500000, nome: 'Shulan Card', id: '300227' },
  { url: BASE_URL + '300080', valorMedio: 350000, nome: 'Greater Red Pepper Card', id: '300080' },
  { url: BASE_URL + '300228', valorMedio: 500000, nome: 'Distorted God Card', id: '300228' },
  { url: BASE_URL + '300239', valorMedio: 1500000, nome: 'Silent Maya Card', id: '300239' },
  { url: BASE_URL + '300262', valorMedio: 1000000, nome: 'The One Card', id: '300262' },
  { url: BASE_URL + '300248', valorMedio: 1000000, nome: 'Death Witch Card', id: '300248' },
  { url: BASE_URL + '300281', valorMedio: 1000000, nome: 'R001-Bestia Card', id: '300281' },
  { url: BASE_URL + '4145', valorMedio: 75000, nome: 'Carta Belzebu', id: '4145' },
  { url: BASE_URL + '700059', valorMedio: 400000, nome: 'Dim Glacier Bow', id: '700059' }
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
    const user = await client.users.fetch(userId);
    const message = `🟢 O item foi encontrado com valor menor ou igual ao valor médio!\n**Item:** ${item.nome}\n**ID do Item:** ${item.id}\n**Loja:** ${loja}\n**Valor:** ${valor}c\n[Link para a loja](${itemUrl})`;

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

        // Modificado para considerar valores iguais ou abaixo do valor médio
        if (!isNaN(valor) && valor <= valorMedio) {
          console.log(`Loja: ${venda.loja} - Valor: ${formatWithCommas(valor)}c (abaixo ou igual ao valor médio de ${formatWithCommas(valorMedio)}c)`);
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
  }, 90000); 
}

client.once('ready', () => {
  console.log('Bot pronto e conectado!');
  iniciarScraping();
});

client.login(discordToken);
