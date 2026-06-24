INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 1, 3, 'CODIGO_BANCO', 3, '341', 'N', true, true, true, false, NULL, '9(03)', 'Número do banco na Câmara de Compensação. Itaú = 341.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 4, 7, 'LOTE_SERVICO', 4, '0', 'N', true, true, true, false, NULL, '9(04)', 'Lote de serviço. Header de arquivo = 0000.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 8, 8, 'TIPO_REGISTRO', 1, '0', 'N', true, true, false, false, NULL, '9(01)', 'Registro header de arquivo.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 9, 17, 'USO_EXCLUSIVO_FEBRABAN_CNAB', 9, NULL, 'B', true, true, false, false, NULL, 'X(09)', 'Brancos. Complemento de registro.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 18, 18, 'TIPO_INSCRICAO_EMPRESA', 1, 'pessoa.tipo_pessoa', 'N', true, true, true, true, 'configuracao.CfgEmpresa', '1//2', '1 = CPF | 2 = CNPJ.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 19, 32, 'NUMERO_INSCRICAO_EMPRESA', 14, 'pessoa.cnpj', 'N', true, true, true, true, 'configuracao.CfgEmpresa', '9(14)', 'Número de inscrição da empresa conforme Nota 2.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 33, 52, 'USO_EXCLUSIVO_FEBRABAN_CNAB', 20, NULL, 'B', true, true, true, false, NULL, 'X(20)', 'Brancos. Complemento de registro.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 53, 53, 'USO_EXCLUSIVO_FEBRABAN_CNAB', 1, '0', 'N', true, true, true, false, NULL, '9(01)', 'Zeros. Complemento de registro.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 54, 57, 'AGENCIA', 4, 'carteira.conta_bancaria.agencia', 'N', true, true, true, true, NULL, '9(04)', 'Agência mantenedora da conta.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 58, 58, 'USO_EXCLUSIVO_FEBRABAN_CNAB', 1, NULL, 'B', true, true, true, false, NULL, 'X(01)', 'Brancos. Complemento de registro.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 59, 65, 'USO_EXCLUSIVO_FEBRABAN_CNAB', 7, '0', 'N', true, true, true, false, NULL, '9(07)', 'Zeros. Complemento de registro.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 66, 70, 'CONTA_CORRENTE', 5, 'carteira.conta_bancaria.conta', 'N', true, true, true, true, NULL, '9(05)', 'Número da conta corrente da empresa.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 71, 71, 'USO_EXCLUSIVO_FEBRABAN_CNAB', 1, NULL, 'B', true, true, true, false, NULL, 'X(01)', 'Brancos. Complemento de registro.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 72, 72, 'DV_CONTA_CORRENTE', 1, 'carteira.conta_bancaria.conta_dv', 'N', true, true, true, true, NULL, '9(01)', 'DAC - dígito de auto-conferência da agência/conta da empresa.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 73, 102, 'NOME_EMPRESA', 30, 'pessoa.nome', 'X', true, true, true, true, 'configuracao.CfgEmpresa', 'X(30)', 'Nome por extenso da empresa mãe conforme Nota 2.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 103, 132, 'NOME_BANCO', 30, 'BANCO ITAU SA', 'X', true, true, true, false, NULL, 'X(30)', 'Nome por extenso do banco cobrador.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 133, 142, 'USO_EXCLUSIVO_FEBRABAN_CNAB', 10, NULL, 'B', true, true, true, false, NULL, 'X(10)', 'Brancos. Complemento de registro.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 143, 143, 'CODIGO_REMESSA', 1, '1', 'N', true, true, false, false, NULL, '9(01)', 'Código do arquivo. 1 = Remessa | 2 = Retorno.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 144, 151, 'DATA_GERACAO_ARQUIVO', 8, NULL, 'N', true, true, true, false, NULL, 'DDMMAAAA', 'Data de geração do arquivo.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 152, 157, 'HORA_GERACAO_ARQUIVO', 6, NULL, 'N', true, true, true, false, NULL, 'HHMMSS', 'Hora de geração do arquivo.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 158, 163, 'SEQUENCIAL_ARQUIVO', 6, NULL, 'N', true, true, true, false, NULL, '9(06)', 'Número sequencial do arquivo.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 164, 166, 'LAYOUT_ARQUIVO', 3, '040', 'N', true, true, true, false, NULL, '9(03)', 'Número da versão do layout do arquivo Itaú.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 167, 171, 'USO_EXCLUSIVO_FEBRABAN_CNAB', 5, '0', 'N', true, true, true, false, NULL, '9(05)', 'Zeros. Complemento de registro.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 172, 225, 'USO_EXCLUSIVO_FEBRABAN_CNAB', 54, NULL, 'B', true, true, true, false, NULL, 'X(54)', 'Brancos. Complemento de registro.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 226, 228, 'USO_EXCLUSIVO_FEBRABAN_CNAB', 3, '0', 'N', true, true, true, false, NULL, '9(03)', 'Zeros. Complemento de registro.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderAr', 229, 240, 'USO_EXCLUSIVO_FEBRABAN_CNAB', 12, NULL, 'B', true, true, true, false, NULL, 'X(12)', 'Brancos. Complemento de registro.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 1, 3, 'CODIGO_BANCO', 3, '341', 'N', true, true, false, false, NULL, '9(03)', 'Número do banco na Câmara de Compensação. Itaú = 341.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 4, 7, 'LOTE DE SERVIÇO', 4, '1', 'N', true, true, false, false, NULL, '9(04)', 'Lote de serviço. Primeiro lote = 0001.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 8, 8, 'TIPO_DE_REGISTRO', 1, '1', 'N', true, true, false, false, NULL, '9(01)', 'Registro header de lote.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 9, 9, 'TIPO_DE_OPERACAO', 1, 'R', 'X', true, true, false, false, NULL, 'X(01)', 'R = Remessa | T = Retorno.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 10, 11, 'TIPO_DE_SERVIÇO', 2, '01', 'N', true, true, false, false, NULL, '9(02)', 'Identificação do tipo de serviço. Cobrança = 01.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 12, 13, 'USO_EXCLUSIVO_BANCO', 2, '0', 'N', true, true, false, false, NULL, '9(02)', 'Zeros. Complemento de registro.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 14, 16, 'LAYOUT_LOTE', 3, '030', 'N', true, true, false, false, NULL, '9(03)', 'Número da versão do layout do lote Itaú.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 17, 17, 'USO_EXCLUSIVO_BANCO', 1, NULL, 'B', true, true, false, false, NULL, 'X(01)', 'Brancos. Complemento de registro.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 18, 18, 'TIPO_INSCRICAO_EMPRESA', 1, 'pessoa.tipo_pessoa', 'N', true, true, false, true, 'configuracao.CfgEmpresa', '1//2', '1 = CPF | 2 = CNPJ.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 19, 33, 'NUMERO_INSCRICAO_EMPRESA', 15, 'pessoa.cnpj', 'N', true, true, false, true, 'configuracao.CfgEmpresa', '9(15)', 'Número de inscrição da empresa conforme Nota 2.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 34, 53, 'USO_EXCLUSIVO_BANCO', 20, NULL, 'B', true, true, false, false, NULL, 'X(20)', 'Brancos. Complemento de registro.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 54, 54, 'USO_EXCLUSIVO_BANCO', 1, '0', 'N', true, true, false, false, NULL, '9(01)', 'Zeros. Complemento de registro.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 55, 58, 'AGENCIA', 4, 'carteira.conta_bancaria.agencia', 'N', true, true, false, true, NULL, '9(04)', 'Agência mantenedora da conta.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 59, 59, 'USO_EXCLUSIVO_BANCO', 1, NULL, 'B', true, true, false, false, NULL, 'X(01)', 'Brancos. Complemento de registro.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 60, 66, 'USO_EXCLUSIVO_BANCO', 7, '0', 'N', true, true, false, false, NULL, '9(07)', 'Zeros. Complemento de registro.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 67, 71, 'CONTA_CORRENTE', 5, 'carteira.conta_bancaria.conta', 'N', true, true, false, true, NULL, '9(05)', 'Número da conta corrente.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 72, 72, 'USO_EXCLUSIVO_BANCO', 1, NULL, 'B', true, true, false, false, NULL, 'X(01)', 'Brancos. Complemento de registro.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 73, 73, 'DV_CONTA_CORRENTE', 1, 'carteira.conta_bancaria.conta_dv', 'N', true, true, false, true, NULL, '9(01)', 'DAC - dígito de auto-conferência da agência/conta da empresa. Deve ter 1 único dígito.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 74, 103, 'NOME_EMPRESA', 30, 'pessoa.nome', 'X', true, true, false, true, 'configuracao.CfgEmpresa', 'X(30)', 'Nome da empresa conforme Nota 2.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 104, 183, 'USO_EXCLUSIVO_BANCO', 80, NULL, 'B', true, true, false, false, NULL, 'X(80)', 'Brancos. Complemento de registro.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 184, 191, 'NUMERO_SEQUENCIAL_REMESSA', 8, NULL, 'N', true, true, false, false, NULL, '9(08)', 'Número sequencial do arquivo retorno/remessa. Preenchido pelo gerador com sequencialRemessa.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 192, 199, 'DATA_GERACAO', 8, NULL, 'N', true, true, false, false, NULL, 'DDMMAAAA', 'Data de gravação do arquivo. Preenchida pelo gerador.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 200, 207, 'DATA_CREDITO', 8, NULL, 'N', true, true, false, false, NULL, 'DDMMAAAA', 'Data do crédito. Em remessa, sem conteúdo, será preenchida com zeros.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'HeaderLt', 208, 240, 'USO_EXCLUSIVO_BANCO', 33, NULL, 'B', true, true, false, false, NULL, 'X(33)', 'Brancos. Complemento de registro.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 1, 3, 'CODIGO_BANCO', 3, '341', 'N', true, true, true, false, NULL, '9(03)', 'Itaú = 341.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 4, 7, 'LOTE DE SERVIÇO', 4, '1', 'N', true, true, true, false, NULL, '9(04)', 'Lote de serviço. Primeiro lote = 0001.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 8, 8, 'TIPO_DE_REGISTRO', 1, '3', 'N', true, true, true, false, NULL, '9(01)', 'Registro detalhe.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 9, 13, 'NUMERO_REGISTRO', 5, '0', 'N', true, true, true, false, NULL, '9(05)', 'Número sequencial do registro no lote.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 14, 14, 'SEGMENTO', 1, 'P', 'X', true, true, true, false, NULL, 'X(01)', 'Segmento P.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 15, 15, 'USO_EXCLUSIVO_BANCO', 1, NULL, 'B', true, true, true, false, NULL, 'X(01)', 'Brancos.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 16, 17, 'CODIGO_MOVIMENTO', 2, '01', 'N', true, true, true, false, NULL, '9(02)', 'Código de ocorrência. 01 = remessa.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 18, 18, 'USO_EXCLUSIVO_BANCO', 1, '0', 'N', true, true, true, false, NULL, '9(01)', 'Zeros.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 19, 22, 'AGENCIA', 4, 'carteira.conta_bancaria.agencia', 'N', true, true, true, true, NULL, '9(04)', 'Agência mantenedora da conta.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 23, 23, 'USO_EXCLUSIVO_BANCO', 1, NULL, 'B', true, true, true, false, NULL, 'X(01)', 'Brancos.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 24, 30, 'USO_EXCLUSIVO_BANCO', 7, '0', 'N', true, true, true, false, NULL, '9(07)', 'Zeros.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 31, 35, 'CONTA_CORRENTE', 5, 'carteira.conta_bancaria.conta', 'N', true, true, true, true, NULL, '9(05)', 'Número da conta corrente.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 36, 36, 'USO_EXCLUSIVO_BANCO', 1, NULL, 'B', true, true, true, false, NULL, 'X(01)', 'Brancos.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 37, 37, 'DV_CONTA_CORRENTE', 1, 'carteira.conta_bancaria.conta_dv', 'N', true, true, true, true, NULL, '9(01)', 'DAC da agência/conta. Deve ter 1 único dígito.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 38, 40, 'CARTEIRA', 3, '109', 'N', true, true, true, false, NULL, '9(03)', 'Carteira Itaú.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 41, 48, 'NOSSO_NUMERO', 8, 'nosso_numero', 'N', true, true, true, true, NULL, '9(08)', 'Nosso número.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 49, 49, 'NOSSO_NUMERO_DV', 1, 'nosso_numero_dv', 'N', true, true, true, true, NULL, '9(01)', 'DAC do Nosso Número.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 50, 57, 'USO_EXCLUSIVO_BANCO', 8, NULL, 'B', true, true, true, false, NULL, 'X(08)', 'Brancos.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 58, 62, 'USO_EXCLUSIVO_BANCO', 5, '0', 'N', true, true, true, false, NULL, '9(05)', 'Zeros.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 63, 72, 'NUMERO_DOC_CLIENTE', 10, 'contas_receber.documento', 'X', true, true, true, true, NULL, 'X(10)', 'Número do documento de cobrança.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 73, 77, 'USO_EXCLUSIVO_BANCO', 5, NULL, 'B', true, true, true, false, NULL, 'X(05)', 'Brancos.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 78, 85, 'VENCIMENTO_BOLETO', 8, 'contas_receber.data_vencimento', 'N', true, true, true, true, NULL, 'DDMMAAAA', 'Data de vencimento do título.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 86, 100, 'VALOR_TITULO', 15, 'contas_receber.valor_titulo', 'N', true, true, true, true, NULL, '9(13)V9(2)', 'Valor nominal do título.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 101, 105, 'AGENCIA_COBRADORA', 5, NULL, 'N', true, true, true, false, NULL, '9(05)', 'Agência cobradora. Zeros quando não informada.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 106, 106, 'DV_AGENCIA_COB', 1, '0', 'N', true, true, true, false, NULL, '9(01)', 'DAC da agência cobradora.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 107, 108, 'ESPECIE_TITULO', 2, '01', 'N', true, true, true, false, NULL, '9(02)', 'Espécie do título.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 109, 109, 'ACEITE', 1, 'N', 'X', true, true, true, false, NULL, 'X(01)', 'A = aceite | N = não aceite.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 110, 117, 'DATA_EMISSAO', 8, 'contas_receber.data_emissao', 'N', true, true, true, true, NULL, 'DDMMAAAA', 'Data de emissão do título.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 118, 118, 'USO_EXCLUSIVO_BANCO', 1, '0', 'N', true, true, true, false, NULL, '9(01)', 'Zeros.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 119, 126, 'DATA_JUROS', 8, 'contas_receber.data_vencimento', 'N', true, true, true, true, NULL, 'DDMMAAAA', 'Data base para cobrança de juros.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 127, 141, 'JUROS', 15, 'juros', 'N', true, true, true, true, NULL, '9(13)V9(2)', 'Valor de mora por dia de atraso.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 142, 142, 'USO_EXCLUSIVO_BANCO', 1, '0', 'N', true, true, true, false, NULL, '9(01)', 'Zeros.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 143, 150, 'DATA_DESCONTO', 8, NULL, 'N', true, true, true, false, NULL, 'DDMMAAAA', 'Data limite do primeiro desconto.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 151, 165, 'VALOR_DESCONTO', 15, NULL, 'N', true, true, true, false, NULL, '9(13)V9(2)', 'Valor do primeiro desconto.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 166, 180, 'VALOR_IOF', 15, NULL, 'N', true, true, true, false, NULL, '9(13)V9(2)', 'Valor do IOF.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 181, 195, 'VALOR_ABATIMENTO', 15, NULL, 'N', true, true, true, false, NULL, '9(13)V9(2)', 'Valor do abatimento.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 196, 220, 'NUMERO_DOC_CLIENTE', 25, 'contas_receber.documento', 'X', true, true, true, true, NULL, 'X(25)', 'Identificação do título na empresa.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 221, 221, 'CODIGO_PROTESTO', 1, '1', 'N', true, true, true, false, NULL, '9(01)', 'Código para negativação/protesto.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 222, 223, 'PRAZO_PROTESTO', 2, 'carteira.nro_dias_protesto', 'N', true, true, true, true, NULL, '9(02)', 'Prazo para negativação/protesto.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 224, 224, 'CODIGO_BAIXA', 1, '0', 'N', true, true, true, false, NULL, '9(01)', 'Código para baixa.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 225, 226, 'PRAZO_BAIXA', 2, NULL, 'N', true, true, true, false, NULL, '9(02)', 'Prazo para baixa.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 227, 239, 'USO_EXCLUSIVO_BANCO', 13, '0', 'N', true, true, true, false, NULL, '9(13)', 'Zeros.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoP', 240, 240, 'USO_EXCLUSIVO_BANCO', 1, NULL, 'B', true, true, true, false, NULL, 'X(01)', 'Brancos.');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 1, 3, 'CODIGO_BANCO', 3, '341', 'N', true, true, true, false, NULL, '9(03)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 4, 7, 'CODIGO_LOTE', 4, '0001', 'N', true, true, true, false, NULL, '9(04)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 8, 8, 'TIPO_REGISTRO', 1, '3', 'N', true, true, true, false, NULL, '9(01)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 9, 13, 'NUMERO_REGISTRO', 5, '0', 'N', true, true, true, false, NULL, '9(05)', 'Preenchido pelo contador do gerador');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 14, 14, 'SEGMENTO', 1, 'Q', 'X', true, true, true, false, NULL, 'X(01)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 15, 15, 'BRANCOS_1', 1, NULL, 'B', true, true, true, false, NULL, 'X(01)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 16, 17, 'CODIGO_MOVIMENTO', 2, '01', 'N', true, true, true, false, NULL, '9(02)', 'Pode ser sobrescrito pelo gerador');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 18, 18, 'TIPO_INSCRICAO_CLIENTE', 1, 'cliente.tipo_pessoa', 'N', true, true, true, true, NULL, '9(01)', '1 CPF / 2 CNPJ conforme conversão do gerador');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 19, 33, 'NUMERO_INSCRICAO_CLIENTE', 15, 'cliente.cnpj', 'N', true, true, true, true, NULL, '9(15)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 34, 63, 'NOME', 30, 'cliente.nome', 'X', true, true, true, true, NULL, 'X(30)', 'Nome do pagador sem acentuação');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 64, 73, 'BRANCOS_2', 10, NULL, 'B', true, true, true, false, NULL, 'X(10)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 74, 113, 'ENDERECO', 40, 'endereco', 'X', true, true, true, true, 'pessoa.PesPessoaEndereco', 'X(40)', 'Gerador monta logradouro, endereço, número e complemento');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 114, 128, 'BAIRRO', 15, 'bairro', 'X', true, true, true, true, 'pessoa.PesPessoaEndereco', 'X(15)', 'Campo não comprovado nos JSONs; validar se bairro é string ou FK');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 129, 133, 'CEP', 5, 'cep', 'N', true, true, true, true, 'pessoa.PesPessoaEndereco', '9(05)', 'Gerador usa os 5 primeiros caracteres');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 134, 136, 'SUFIXO_CEP', 3, 'cep', 'N', true, true, true, true, 'pessoa.PesPessoaEndereco', '9(03)', 'Gerador usa caracteres 5 a 8');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 137, 151, 'CIDADE', 15, 'cidade.nome', 'X', true, true, true, true, 'pessoa.PesPessoaEndereco', 'X(15)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 152, 153, 'UF', 2, 'cidade.estado.uf', 'X', true, true, true, true, 'pessoa.PesPessoaEndereco', 'X(02)', 'Usado para evitar dependência de estado direto no endereço');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 154, 154, 'CODIGO_INSCRICAO_SACADOR_AVALISTA', 1, '0', 'N', true, true, true, false, NULL, '9(01)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 155, 169, 'NUMERO_INSCRICAO_SACADOR_AVALISTA', 15, '0', 'N', true, true, true, false, NULL, '9(15)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 170, 199, 'NOME_SACADOR_AVALISTA', 30, NULL, 'B', true, true, true, false, NULL, 'X(30)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 200, 209, 'BRANCOS_3', 10, NULL, 'B', true, true, true, false, NULL, 'X(10)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 210, 212, 'ZEROS_1', 3, '0', 'N', true, true, true, false, NULL, '9(03)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoQ', 213, 240, 'BRANCOS_4', 28, NULL, 'B', true, true, true, false, NULL, 'X(28)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 1, 3, 'CODIGO_BANCO', 3, '341', 'N', true, true, true, false, NULL, '9(03)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 4, 7, 'CODIGO_LOTE', 4, '0001', 'N', true, true, true, false, NULL, '9(04)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 8, 8, 'TIPO_REGISTRO', 1, '3', 'N', true, true, true, false, NULL, '9(01)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 9, 13, 'NUMERO_REGISTRO', 5, '0', 'N', true, true, true, false, NULL, '9(05)', 'Preenchido pelo contador do gerador');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 14, 14, 'SEGMENTO', 1, 'R', 'X', true, true, true, false, NULL, 'X(01)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 15, 15, 'BRANCOS_1', 1, NULL, 'B', true, true, true, false, NULL, 'X(01)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 16, 17, 'CODIGO_MOVIMENTO', 2, '01', 'N', true, true, true, false, NULL, '9(02)', 'Pode ser sobrescrito pelo gerador');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 18, 18, 'ZEROS_1', 1, '0', 'N', true, true, true, false, NULL, '9(01)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 19, 26, 'DATA_DESCONTO_2', 8, '0', 'N', true, true, true, false, NULL, 'DDMMAAAA', 'Sem regra dinâmica no gerador; preenchido com zeros');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 27, 41, 'VALOR_DESCONTO_2', 15, '0', 'N', true, true, true, false, NULL, '9(13)V9(2)', 'Sem regra dinâmica no gerador; preenchido com zeros');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 42, 42, 'ZEROS_2', 1, '0', 'N', true, true, true, false, NULL, '9(01)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 43, 50, 'DATA_DESCONTO_3', 8, '0', 'N', true, true, true, false, NULL, 'DDMMAAAA', 'Sem regra dinâmica no gerador; preenchido com zeros');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 51, 65, 'VALOR_DESCONTO_3', 15, '0', 'N', true, true, true, false, NULL, '9(13)V9(2)', 'Sem regra dinâmica no gerador; preenchido com zeros');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 66, 66, 'CODIGO_MULTA', 1, NULL, 'N', true, true, true, false, NULL, '9(01)', 'Gerado pelo código: 0 sem multa, 1 valor fixo, 2 percentual');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 67, 74, 'DATA_MULTA', 8, NULL, 'N', true, true, true, false, NULL, 'DDMMAAAA', 'Gerado pelo código: data_vencimento + carteira.multa_numero_dias');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 75, 89, 'VALOR_PERCENTUAL_MULTA', 15, NULL, 'N', true, true, true, false, NULL, '9(13)V9(2)', 'Gerado pelo código usando carteira.valor_multa ou carteira.percentual_multa');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 90, 99, 'BRANCOS_2', 10, NULL, 'B', true, true, true, false, NULL, 'X(10)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 100, 139, 'INFORMACAO_PAGADOR', 40, NULL, 'B', true, true, true, false, NULL, 'X(40)', 'Sem caminho dinâmico comprovado nas bases/código');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 140, 199, 'BRANCOS_3', 60, NULL, 'B', true, true, true, false, NULL, 'X(60)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 200, 207, 'CODIGO_OCORRENCIA_PAGADOR', 8, '0', 'N', true, true, true, false, NULL, '9(08)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 208, 215, 'ZEROS_3', 8, '0', 'N', true, true, true, false, NULL, '9(08)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 216, 216, 'BRANCOS_4', 1, NULL, 'B', true, true, true, false, NULL, 'X(01)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 217, 228, 'ZEROS_4', 12, '0', 'N', true, true, true, false, NULL, '9(12)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 229, 230, 'BRANCOS_5', 2, NULL, 'B', true, true, true, false, NULL, 'X(02)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 231, 231, 'ZEROS_5', 1, '0', 'N', true, true, true, false, NULL, '9(01)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'SegmentoR', 232, 240, 'BRANCOS_6', 9, NULL, 'B', true, true, true, false, NULL, 'X(09)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'TrailerLt', 1, 3, 'CODIGO_BANCO', 3, '341', 'N', true, true, true, false, NULL, '9(03)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'TrailerLt', 4, 7, 'CODIGO_LOTE', 4, '0001', 'N', true, true, true, false, NULL, '9(04)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'TrailerLt', 8, 8, 'TIPO_REGISTRO', 1, '5', 'N', true, true, true, false, NULL, '9(01)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'TrailerLt', 9, 17, 'BRANCOS_1', 9, NULL, 'B', true, true, true, false, NULL, 'X(09)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'TrailerLt', 18, 23, 'QTD_REGISTROS_LOTE', 6, NULL, 'N', true, true, true, false, NULL, '9(06)', 'Gerado pelo código: (qtd_registros * qtdSubRegistro) + 2');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'TrailerLt', 24, 29, 'QTD_TITULOS_COB_SIMPLES', 6, NULL, 'N', true, true, true, false, NULL, '9(06)', 'Gerado pelo código com quantidade de títulos');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'TrailerLt', 30, 46, 'VALOR_TITULOS_COB_SIMPLES', 17, NULL, 'N', true, true, true, false, NULL, '9(15)V9(2)', 'Gerado pelo código com soma de contas_receber.valor_total');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'TrailerLt', 47, 52, 'QTD_TITULOS_COB_VINCULADA', 6, '0', 'N', true, true, true, false, NULL, '9(06)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'TrailerLt', 53, 69, 'VALOR_TITULOS_COB_VINCULADA', 17, '0', 'N', true, true, true, false, NULL, '9(15)V9(2)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'TrailerLt', 70, 115, 'ZEROS_1', 46, '0', 'N', true, true, true, false, NULL, '9(46)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'TrailerLt', 116, 123, 'AVISO_BANCARIO', 8, NULL, 'B', true, true, true, false, NULL, 'X(08)', 'Sem regra dinâmica comprovada no código/bases');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'TrailerLt', 124, 240, 'BRANCOS_2', 117, NULL, 'B', true, true, true, false, NULL, 'X(117)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'TrailerAr', 1, 3, 'CODIGO_BANCO', 3, '341', 'N', true, true, true, false, NULL, '9(03)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'TrailerAr', 4, 7, 'CODIGO_LOTE', 4, '9999', 'N', true, true, true, false, NULL, '9(04)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'TrailerAr', 8, 8, 'TIPO_REGISTRO', 1, '9', 'N', true, true, true, false, NULL, '9(01)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'TrailerAr', 9, 17, 'BRANCOS_1', 9, NULL, 'B', true, true, true, false, NULL, 'X(09)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'TrailerAr', 18, 23, 'QTD_REGISTROS_LOTE', 6, NULL, 'N', true, true, true, false, NULL, '9(06)', 'Gerado pelo código: fixo 1 lote por arquivo');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'TrailerAr', 24, 29, 'QTD_REGISTROS_ARQUIVO', 6, NULL, 'N', true, true, true, false, NULL, '9(06)', 'Gerado pelo código: (qtd_registros * qtdSubRegistro) + 4');
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'TrailerAr', 30, 35, 'ZEROS_1', 6, '0', 'N', true, true, true, false, NULL, '9(06)', NULL);
INSERT INTO public.cad_cobranca_padrao
(tipo_registro, tipo_sub_registro, posicao_inicial, posicao_final, nome, tamanho, conteudo, tipo_dado, e_ativo, e_padrao, e_visivel, e_variavel, tabela, formato, observacao)
VALUES('REM', 'TrailerAr', 36, 240, 'BRANCOS_2', 205, NULL, 'B', true, true, true, false, NULL, 'X(205)', NULL);