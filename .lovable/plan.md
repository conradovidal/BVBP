

## Substituir foto do Conrado

### Alterações

1. **Copiar imagem**: Copiar `user-uploads://CONRADO.jpeg` para `public/lovable-uploads/conrado-vidal.jpeg`

2. **`src/pages/Index.tsx`** (linha ~118): Atualizar o path da foto do Conrado de `/lovable-uploads/c237e246-d750-44a5-96a1-510e298e84ed.png` para `/lovable-uploads/conrado-vidal.jpeg`

3. **`src/pages/Index.tsx`** (linha ~564): Adicionar classe `grayscale` na tag `<img>` dos membros do time para aplicar o filtro preto e branco via CSS, mantendo consistência visual com as fotos existentes.

### Nota
Como as fotos atuais parecem já estar em preto e branco no arquivo original, aplicarei `grayscale` via CSS em todas as fotos do time para garantir uniformidade caso alguma nova foto colorida seja adicionada no futuro.

