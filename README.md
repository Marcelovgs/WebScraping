# Discord Bot & Web Scraper - History Reborn

## Descrição
Este projeto é um bot que utiliza o Puppeteer para fazer scraping de preços de itens em um site de marketplace e envia notificações personalizadas para o Discord quando o preço de um item está abaixo ou igual ao valor médio definido.

## Tecnologias Utilizadas
- **Node.js**: Ambiente de execução JavaScript para o backend do projeto.
- **Puppeteer**: Ferramenta de automação de navegadores para realizar o scraping dos dados no site.
- **Puppeteer-extra**: Extensão do Puppeteer que permite o uso de plugins, como o plugin de stealth.
- **puppeteer-extra-plugin-stealth**: Plugin utilizado para evitar que o site detecte que o navegador está sendo controlado automaticamente.
- **Discord.js**: Biblioteca para interação com a API do Discord, permitindo o envio de notificações ao usuário.

## Funcionalidades
- Rastreia preços de itens em um site de marketplace.
- Verifica se o preço atual é menor ou igual ao valor médio definido.
- Envia notificações para o Discord com detalhes do item, loja e imagem quando o preço está abaixo do valor médio.
- Realiza scraping periodicamente, a cada 90 segundos, para monitorar os preços em tempo real.

## Configuração e Instalação

### Pré-requisitos
- **Node.js**: Certifique-se de ter o Node.js instalado em sua máquina. Se não, baixe-o [aqui](https://nodejs.org/).
- **Token do Discord**: Você precisará de um bot no Discord com permissões para enviar mensagens. Consulte a [documentação oficial](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) para criar um bot e obter seu token.
