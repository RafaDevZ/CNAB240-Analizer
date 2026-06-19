# CNAB240 Viewer

Visualizador moderno para arquivos CNAB240, criado para inspecionar remessas e retornos bancarios de forma rapida, visual e segura.

O app colore cada trecho da linha conforme o layout do banco selecionado, mostra detalhes do campo selecionado, valida linhas com tamanho diferente de 240 caracteres e evidencia espacos em branco no estilo de editores como o VS Code.

## Plug and Play

Baixe ou clone o diretorio do projeto, instale as dependencias e rode.

```bash
npm install
npm run dev
```

Depois disso, abra a URL exibida no terminal, cole o CNAB no input e use o visualizador.

## Recursos

- Visualizacao colorida de campos CNAB240 por posicao.
- Validacao de linhas com exatamente 240 colunas.
- Indicador verde/vermelho para o tamanho das linhas.
- Destaque no input do mesmo campo clicado no arquivo interpretado.
- Marcacao visual de espacos em branco com pontos discretos.
- Destaque forte para caracteres que passam da coluna 240.
- Tooltip customizado com Tippy + Framer Motion.
- Painel lateral com segmento, posicao, descricao, tipo e conteudo esperado.
- Interface dark, minimalista e inspirada em ferramentas de desenvolvimento.

## Layouts Suportados

Atualmente o projeto inclui layouts para:

- Caixa SIGCB
- Sicredi
- Sicredi Retorno
- Itau

Os arquivos ficam em:

```txt
src/layouts/
```

Cada JSON representa uma lista de segmentos/registros. A ordem esperada pelo app e:

```txt
0 - Header de arquivo
1 - Header de lote
2 - Segmento P
3 - Segmento Q
4 - Segmento R
5 - Trailer de lote
6 - Trailer de arquivo
```

## Como Rodar

Instale as dependencias:

```bash
npm install
```

Rode em desenvolvimento:

```bash
npm run dev
```

Gere o build de producao:

```bash
npm run build
```

Visualize o build localmente:

```bash
npm run preview
```

## Como Usar

1. Selecione o layout do banco no topo.
2. Cole o conteudo CNAB no input.
3. Confira o indicador de colunas:
   - verde: linhas validas com 240 caracteres;
   - vermelho: pelo menos uma linha com tamanho diferente de 240.
4. Passe o mouse sobre os campos coloridos para ver o tooltip.
5. Clique em um campo para fixar os detalhes no painel lateral e destacar o mesmo trecho no input.

## Validacao de Colunas

O CNAB240 exige linhas com 240 caracteres.

O app preserva espacos em branco no final da linha, porque eles fazem parte do arquivo. Linhas vazias finais aparecem no viewer, mas nao interferem na validacao de colunas.

Quando uma linha passa de 240 caracteres, o excedente aparece em vermelho vivo no input.

## Adicionando um Novo Layout

1. Crie um arquivo JSON em `src/layouts/`.
2. Siga o formato:

```json
[
  [
    {
      "inicio": 1,
      "fim": 3,
      "label": "CODIGO_BANCO",
      "descricao": "Codigo do banco na Camara de Compensacao",
      "tipo": "Numerico",
      "conteudo": "341",
      "bgColor": "rgba(255,99,99,0.8)",
      "textColor": "#000"
    }
  ]
]
```

3. Importe o JSON em `src/App.tsx`.
4. Adicione o banco em `layoutsPorBanco`.
5. Adicione a opcao no array `bancos`.

## Estrutura do Projeto

```txt
src/
  App.tsx           # Logica principal do viewer
  styles.ts        # Componentes estilizados e tema visual
  main.tsx         # Entrada React
  layouts/         # Definicoes dos layouts CNAB
```

## Stack

- React
- TypeScript
- Vite
- Styled Components
- Tippy.js
- Framer Motion

---

# CNAB240 Viewer

Modern viewer for CNAB240 files, built to inspect bank remittance and return files in a fast, visual, and safe way.

The app colors each part of a line according to the selected bank layout, displays details for the selected field, validates lines with a length different from 240 characters, and makes blank spaces visible in a VS Code-like style.

## Plug and Play

Download or clone the project directory, install the dependencies, and run it.

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal, paste the CNAB content into the input, and start using the viewer.

## Features

- Colorized CNAB240 field visualization by position.
- Validation for lines with exactly 240 columns.
- Green/red indicator for line length.
- Input highlight for the same field clicked in the interpreted file.
- Visual marking for blank spaces with subtle dots.
- Strong highlight for characters beyond column 240.
- Custom tooltip with Tippy + Framer Motion.
- Side panel with segment, position, description, type, and expected content.
- Dark, minimal, developer-tool-inspired interface.

## Supported Layouts

The project currently includes layouts for:

- Caixa SIGCB
- Sicredi
- Sicredi Return
- Itau

The files are located at:

```txt
src/layouts/
```

Each JSON file represents a list of segments/records. The order expected by the app is:

```txt
0 - File header
1 - Batch header
2 - Segment P
3 - Segment Q
4 - Segment R
5 - Batch trailer
6 - File trailer
```

## How to Run

Install dependencies:

```bash
npm install
```

Run in development mode:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## How to Use

1. Select the bank layout at the top.
2. Paste the CNAB content into the input.
3. Check the column indicator:
   - green: valid lines with 240 characters;
   - red: at least one line has a length different from 240.
4. Hover over the colored fields to see the tooltip.
5. Click a field to pin its details in the side panel and highlight the same range in the input.

## Column Validation

CNAB240 requires lines with 240 characters.

The app preserves trailing blank spaces because they are part of the file. Final empty lines are shown in the viewer, but they do not affect column validation.

When a line goes beyond 240 characters, the extra content is highlighted in bright red in the input.

## Adding a New Layout

1. Create a JSON file in `src/layouts/`.
2. Follow this format:

```json
[
  [
    {
      "inicio": 1,
      "fim": 3,
      "label": "CODIGO_BANCO",
      "descricao": "Bank code in the clearing house",
      "tipo": "Numeric",
      "conteudo": "341",
      "bgColor": "rgba(255,99,99,0.8)",
      "textColor": "#000"
    }
  ]
]
```

3. Import the JSON file in `src/App.tsx`.
4. Add the bank to `layoutsPorBanco`.
5. Add the option to the `bancos` array.

## Project Structure

```txt
src/
  App.tsx           # Main viewer logic
  styles.ts        # Styled components and visual theme
  main.tsx         # React entry point
  layouts/         # CNAB layout definitions
```

## Stack

- React
- TypeScript
- Vite
- Styled Components
- Tippy.js
- Framer Motion
