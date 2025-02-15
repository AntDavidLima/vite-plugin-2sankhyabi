# @insulino/vite-plugin-2sankhyabi

Plugin Vite para converter aplicações React (e outros frameworks suportados pelo Vite) em dashboards compatíveis com Sankhya BI.

## Funcionalidades

- Transforma o arquivo index.html em um index.jsp adequado para execução em Sankhya BI.

- Substitui caminhos de assets estáticos (scripts e estilos) por variáveis dinâmicas compatíveis com Sankhya.

- Gera um arquivo ZIP do diretório de build contendo a aplicação pronta para deploy.

## Instalação

```bash
npm install @insulino/vite-plugin-2sankhyabi --save-dev
```

Ou com yarn:

```bash
yarn add @insulino/vite-plugin-2sankhyabi -D
```

## Uso

Adicione o plugin ao seu vite.config.ts:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { convertToSankhyaBI } from '@insulino/vite-plugin-2sankhyabi';

export default defineConfig({
  plugins: [
    react(),
    { ...convertToSankhyaBI(), apply: 'build' }
  ]
});
```

Após o build (vite build), o plugin executará as seguintes ações automaticamente:

- Converterá o index.html para index.jsp.

- Ajustará os caminhos dos assets dinâmicos, como scripts e estilos.

- Atualizará os arquivos .js para resolver imagens estáticas corretamente.

- Compactará todo o conteúdo do diretório dist em um arquivo build.zip.

## Resultado

Após rodar o comando:

```bash
vite build
```

Você terá um arquivo build.zip pronto para ser importado como dashboard no Sankhya BI.

Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request no repositório.

Licença

Este projeto está licenciado sob a Licença MIT.

Autor: David Lima