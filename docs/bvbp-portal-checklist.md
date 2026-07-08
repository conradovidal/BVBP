# Checklist Interno do Portal BVBP

## Rodar localmente

```sh
npm install
npm run dev
```

Abra `http://localhost:8080` quando o servidor estiver nessa porta, ou use a porta indicada pelo Vite.

## Acessar o admin

- URL: `/login`
- Admin: `conrado@bvbp.com.br`
- Senha: `bvbp90`

## Usar o workspace BVBP

- Entre no Portal BVBP.
- Abra `Clientes` ou `Visão geral`.
- Clique em `Abrir` no item BVBP, ou selecione `BVBP` no seletor do app de Performance.

## Criar iniciativa PDCA

- Acesse `/app/performance/execution`.
- Clique em `Nova iniciativa`.
- Preencha pelo menos `Nome` e `Ponteiro afetado`.
- Salve e ajuste o status no card do board quando necessário.

## Registrar evidência

- Abra uma iniciativa no board PDCA.
- Na seção `Evidências`, descreva o aprendizado ou dado observado.
- Clique em `Registrar evidência`.

## Resetar dados locais

- Acesse `/app/admin/settings`.
- Clique em `Restaurar`.
- Digite `RESTAURAR`.
- Confirme `Restaurar dados`.

O reset restaura clientes seedados, workspace BVBP, ciclos PDCA e evidências locais. A sessão atual é preservada.

## O que ainda é mockado/local

- Login e papéis.
- Clientes, prospects e workspace BVBP.
- Pipeline, ponteiros, automações e vazamentos.
- Ciclos PDCA e evidências, salvos em `localStorage`.
- Impactos financeiros são potenciais estimados, não ROI comprovado.

## Antes de subir para dev/prod

- Rodar `npm run lint`.
- Rodar `npm run build`.
- Validar `/app/admin`, `/app/admin/clients`, `/app/admin/content` e `/app/admin/settings`.
- Validar `/app/performance/overview`, `pointers`, `funnel`, `operations`, `execution` e `automations`.
- Testar criação de iniciativa, mudança de status e registro de evidência.
- Testar reset local.
- Testar mobile em 390px.
