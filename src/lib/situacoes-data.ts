/**
 * Dados para páginas programáticas por situação fiscal.
 * Cada entrada descreve um tipo de contribuinte e as suas implicações fiscais.
 */

import type { Exemplo } from './exemplos';

export interface SituacaoEntry {
  slug: string;
  label: string;
  estadoCivil: "solteiro" | "casado1titular" | "casado2titulares";
  dependentes: number;
  irsJovem: number;
  descricao: string;
  implicacoesFiscais: string;
  conselhosDetalhados: string;
  /** Titre et description propres a la page : les libelles vont de 8 a 23
      caracteres, un gabarit unique ne pouvait donc pas tenir les bornes 50-60
      et 150-160 de la recette (§6). */
  tituloSeo: string;
  descricaoSeo: string;
  /** Les erreurs propres a ce regime, pas une liste generique. */
  errosFrequentes: string[];
  /** Ce que la declaration annuelle reserve dans cette situation. */
  acertoAnual: string;
  /** Explication du calcul et exemples chiffres, propres a la situation. */
  calculo: {
    intro: string;
    etapas: { titulo: string; texto: string }[];
    /** Hypotheses seulement : les montants sont calcules par le moteur (§4). */
    exemplos: Exemplo[];
    atencao: string;
  };
  faq: { pergunta: string; resposta: string }[];
}

export const SITUACOES: SituacaoEntry[] = [
  {
    slug: "solteiro",
    errosFrequentes: [
      "Pedir a alteração da tabela ao mudar de estado civil apenas na declaração anual, e não junto do empregador: a retenção fica desajustada durante meses.",
      "Esquecer de pedir fatura com NIF nas despesas de saúde e educação, únicas alavancas reais de quem não tem dependentes.",
      "Confundir a taxa marginal do escalão com a taxa efetivamente paga: a primeira aplica-se apenas à parcela de rendimento acima do limite."
],
    acertoAnual: "Sem cônjuge nem dependentes, a retenção mensal aproxima-se bastante do imposto devido: a tabela de não casado é construída para isso. O reembolso, quando existe, vem quase sempre das deduções à coleta, e não de um excesso de retenção. Registar as faturas com NIF ao longo do ano é, nesta situação, o único fator que o trabalhador controla verdadeiramente: saúde, educação, habitação e lares reduzem o imposto já calculado, não o rendimento. Quem tem um PPR acrescenta ainda uma dedução própria, dentro do limite legal por escalão etário.",
    calculo: {
  "intro": "O cálculo faz-se sempre pela mesma ordem, e essa ordem não é indiferente: a Segurança Social desconta primeiro, e só o que sobra entra na base do IRS. Inverter os dois passos sobrestima o imposto, e é o erro mais comum de quem faz a conta à mão.",
  "etapas": [
    {
      "titulo": "Contribuição para a Segurança Social (TSU)",
      "texto": "Aplicam-se 11 % ao salário bruto ilíquido, sem qualquer limite superior: ao contrário de outros países, não existe teto contributivo em Portugal. Esta contribuição não é dedutível do bruto para efeitos de retenção mensal, mas conta como dedução específica na declaração anual quando supera o valor fixo."
    },
    {
      "titulo": "Escolha da tabela de retenção",
      "texto": "Para quem é solteiro, divorciado ou viúvo sem dependentes aplica-se a tabela «Não casado, sem dependentes», a que tem as taxas mais elevadas de todas. Não existe quociente conjugal nem redução por dependentes que a atenue."
    },
    {
      "titulo": "Retenção na fonte de IRS",
      "texto": "A tabela devolve uma taxa marginal e uma parcela a abater, aplicadas ao salário do mês. Desde a reforma do modelo, a taxa incide apenas sobre a parcela de rendimento acima de cada limite, o que evita as quebras de líquido que existiam quando se mudava de escalão."
    },
    {
      "titulo": "Subsídio de refeição e subsídios",
      "texto": "O subsídio de refeição fica de fora da base de incidência até ao limite diário isento, mais alto quando pago em cartão do que em dinheiro. Os subsídios de férias e de Natal são tributados à parte, e não somados ao salário do mês, o que evita empurrar esse mês para uma taxa superior."
    }
  ],
  exemplos: [
      {
        titulo: "Exemplo: 1 500 € brutos mensais, solteiro sem dependentes",
        casos: { a: { bruto: 1500, estadoCivil: "solteiro", dependentes: 0, irsJovem: 0 } },
        linhas: [
          { rotulo: "Salário bruto mensal", caso: "a", campo: "bruto" },
          { rotulo: "TSU do trabalhador", nota: "11 % sobre o bruto", caso: "a", campo: "tsu" },
          { rotulo: "Retenção na fonte de IRS", nota: "tabela não casado, sem dependentes", caso: "a", campo: "retencao" },
          { rotulo: "Salário líquido mensal", caso: "a", campo: "liquido" },
          { rotulo: "Taxa efetiva total", caso: "a", campo: "taxaEfetiva" }
        ],
        comentario: "Sobre catorze meses, o rendimento líquido anual ronda os {liquidoAnual:a}. O custo total para a empresa é de cerca de {custoEmpresa:a} por mês, uma vez somada a TSU patronal de 23,75 %."
      },
      {
        titulo: "Exemplo: 2 500 € brutos mensais, solteiro sem dependentes",
        casos: {
          a: { bruto: 1500, estadoCivil: "solteiro", dependentes: 0, irsJovem: 0 },
          b: { bruto: 2500, estadoCivil: "solteiro", dependentes: 0, irsJovem: 0 }
        },
        linhas: [
          { rotulo: "Salário bruto mensal", caso: "b", campo: "bruto" },
          { rotulo: "TSU do trabalhador", nota: "11 % sobre o bruto", caso: "b", campo: "tsu" },
          { rotulo: "Retenção na fonte de IRS", nota: "escalão superior, taxa marginal mais alta", caso: "b", campo: "retencao" },
          { rotulo: "Salário líquido mensal", caso: "b", campo: "liquido" },
          { rotulo: "Taxa efetiva total", caso: "b", campo: "taxaEfetiva" }
        ],
        comentario: "Entre os dois exemplos, o bruto sobe {variacaoBruto:a-b} mas o líquido apenas {variacaoLiquido:a-b}: é o efeito da progressividade. A diferença mede-se na taxa efetiva, que passa de {taxaEfetiva:a} para {taxaEfetiva:b}."
      }
    ],
  "atencao": "estes valores são retenções mensais, não o imposto final. O acerto faz-se na declaração anual, onde as deduções à coleta, saúde, educação, habitação, reduzem o imposto efetivamente devido e geram frequentemente reembolso."
},
    tituloSeo: "Salário Líquido para Solteiros 2026 | Simulador IRS e TSU",
    descricaoSeo: "Simulador de salário líquido para solteiros sem dependentes em Portugal em 2026: a tabela de retenção mais pesada, com IRS, TSU e subsídios detalhados.",
    label: "Solteiro",
    estadoCivil: "solteiro",
    dependentes: 0,
    irsJovem: 0,
    descricao: "O trabalhador solteiro, divorciado ou viúvo sem dependentes é a situação fiscal mais simples e também a que resulta em maior carga tributária relativa. As tabelas de retenção na fonte aplicam as taxas mais elevadas a este perfil, uma vez que não existem deduções por dependentes nem benefícios do quociente conjugal.",
    implicacoesFiscais: "Os trabalhadores solteiros sem dependentes são tributados pela tabela de retenção para 'Não casado / Sem dependentes'. Esta tabela aplica as taxas de retenção mais elevadas para cada nível de rendimento. Na declaração anual de IRS, o rendimento é tributado individualmente, sem possibilidade de tributação conjunta. A dedução pessoal e familiar é de apenas 250€ (um titular, zero dependentes). O rendimento coletável é apurado após a dedução específica de 4.104€ ou, se superior, o valor das contribuições obrigatórias para a Segurança Social.",
    conselhosDetalhados: "Para otimizar a situação fiscal como solteiro sem dependentes, considere: (1) Maximizar as deduções à coleta com despesas de saúde, educação e habitação registadas no e-Fatura; (2) Contribuir para um Plano Poupança Reforma (PPR), que oferece benefícios fiscais até 400€ de dedução; (3) Pedir sempre fatura com NIF para beneficiar da dedução de despesas gerais familiares (até 250€); (4) Verificar se é elegível para o regime de IRS Jovem nos primeiros 5 anos de atividade profissional.",
    faq: [
      {
        pergunta: "Qual a taxa de retenção para solteiros em 2026?",
        resposta: "A taxa de retenção na fonte para solteiros sem dependentes varia entre 0% (para salários até 870€) e 43,5% (para salários acima de 14.000€). Por exemplo, para um salário de 1.500€ brutos, a taxa é de 14,7%. As taxas exatas dependem do escalão de rendimento mensal."
      },
      {
        pergunta: "Solteiros pagam mais IRS do que casados?",
        resposta: "Sim, em geral. Os trabalhadores solteiros não beneficiam do quociente conjugal nem das tabelas de retenção mais favoráveis aplicáveis a casados com um único titular. A diferença é mais significativa em rendimentos médios e altos. Para salários próximos do mínimo, a diferença é reduzida ou nula."
      },
      {
        pergunta: "Como posso reduzir o IRS sendo solteiro?",
        resposta: "As principais estratégias são: pedir faturas com NIF para maximizar deduções no e-Fatura, investir num PPR (dedução até 400€), declarar despesas de saúde (15%, até 1.000€), educação (30%, até 800€) e rendas de habitação (até 502€). Se tem menos de 35 anos, verifique a elegibilidade para o IRS Jovem."
      }
    ,
      {
        pergunta: "A tabela de retenção muda se eu viver em união de facto?",
        resposta: "Não para efeitos de retenção na fonte mensal. A união de facto só produz efeitos fiscais na declaração anual, e apenas se os dois membros optarem expressamente pela tributação conjunta, o que exige dois anos de vida em comum e morada fiscal coincidente. Até lá, o empregador continua a aplicar a tabela de não casado sem dependentes, que é a mais pesada."
      },
      {
        pergunta: "Compensa pedir uma taxa de retenção superior à da tabela?",
        resposta: "Pode compensar se souber que terá imposto a pagar no acerto anual, por exemplo por ter outros rendimentos. Pedir uma retenção mais alta evita a surpresa de junho, mas é um empréstimo sem juros ao Estado: o dinheiro só volta um ano depois. A escolha é sua e comunica-se ao empregador por escrito."
      },
      {
        pergunta: "O subsídio de refeição conta para o cálculo da retenção?",
        resposta: "Não, desde que se mantenha dentro do limite diário isento, mais elevado quando pago em cartão do que em dinheiro. Acima desse limite, o excedente entra na base de incidência e é tributado como remuneração normal, tanto em IRS como em Segurança Social."
      },
      {
        pergunta: "Trabalhar a tempo parcial muda a tabela aplicável?",
        resposta: "A tabela é a mesma, mas aplica-se ao rendimento efetivamente auferido. Um salário parcial mais baixo cai numa faixa de retenção inferior, pelo que a taxa efetiva desce. O que não muda é a taxa de 11% da Segurança Social, que incide sobre a totalidade da remuneração sem limite superior."
      }
    ]
  },
  {
    slug: "casado-1-titular",
    errosFrequentes: [
      "Não comunicar ao empregador que o cônjuge começou a trabalhar: a tabela deixa de ser a correta e o acerto anual traduz-se num valor a pagar.",
      "Declarar os dependentes apenas no ano seguinte ao nascimento, perdendo doze meses de retenção reduzida.",
      "Assumir que a tributação conjunta é sempre a melhor: deixa de o ser quando o cônjuge sem salário aufere outros rendimentos próprios significativos."
],
    acertoAnual: "A tabela aplicada já antecipa o quociente conjugal, pelo que a retenção mensal costuma ficar próxima do devido. O acerto tende a gerar reembolso quando o agregado acumula despesas dedutíveis, que na tributação conjunta se somam num único limite por categoria. A surpresa mais frequente nesta situação vem de uma mudança não comunicada: se o cônjuge começar a auferir rendimentos e a tabela não for alterada, a retenção fica abaixo do devido durante meses e o acerto traduz-se num valor a pagar.",
    calculo: {
  "intro": "Quando só um dos cônjuges aufere rendimentos do trabalho, a tabela de retenção aplicada é a mais favorável de todas. A ordem do cálculo é a mesma, mas a taxa devolvida pela tabela é sensivelmente inferior à de um solteiro com o mesmo salário.",
  "etapas": [
    {
      "titulo": "Contribuição para a Segurança Social (TSU)",
      "texto": "Os mesmos 11 % sobre o bruto, sem teto. O regime familiar não altera esta parcela: a Segurança Social não distingue a situação conjugal, apenas a natureza do vínculo."
    },
    {
      "titulo": "Escolha da tabela de retenção",
      "texto": "Aplica-se a tabela «Casado, único titular», construída sobre o pressuposto de que aquele rendimento sustenta duas pessoas. É esta a razão pela qual a taxa é mais baixa: o legislador antecipa o efeito do quociente conjugal que só se concretizará na declaração anual."
    },
    {
      "titulo": "Dependentes",
      "texto": "Cada dependente faz descer ainda mais a taxa aplicada, através de tabelas próprias. A comunicação ao empregador faz-se pela declaração de situação familiar, e deve ser feita no ano do nascimento para que o efeito se sinta já no salário e não apenas no acerto."
    },
    {
      "titulo": "Acerto na declaração anual",
      "texto": "É aí que a vantagem se confirma: o quociente conjugal divide o rendimento do agregado por dois antes de aplicar os escalões, fazendo descer a taxa marginal. As despesas dos dois cônjuges somam-se num limite comum por categoria."
    }
  ],
  exemplos: [
      {
        titulo: "Exemplo: 2 000 € brutos, casado com único titular, sem dependentes",
        casos: {
          a: { bruto: 2000, estadoCivil: "casado1titular", dependentes: 0, irsJovem: 0 },
          s: { bruto: 2000, estadoCivil: "solteiro", dependentes: 0, irsJovem: 0 }
        },
        linhas: [
          { rotulo: "Salário bruto mensal", caso: "a", campo: "bruto" },
          { rotulo: "TSU do trabalhador", nota: "11 %, idêntica a qualquer situação", caso: "a", campo: "tsu" },
          { rotulo: "Retenção na fonte de IRS", nota: "tabela casado, único titular", caso: "a", campo: "retencao" },
          { rotulo: "Salário líquido mensal", caso: "a", campo: "liquido" },
          { rotulo: "Diferença face a um solteiro", nota: "mesmo bruto, tabela mais pesada", diferenca: ["a", "s"] }
        ],
        comentario: "Com o mesmo salário bruto, o regime de casado com único titular deixa cerca de {difMensal:a-s} a mais por mês do que a tabela de solteiro, ou perto de {difAnual:a-s} por ano sobre catorze meses."
      },
      {
        titulo: "Exemplo: 2 000 € brutos com dois dependentes",
        casos: {
          a: { bruto: 2000, estadoCivil: "casado1titular", dependentes: 0, irsJovem: 0 },
          d: { bruto: 2000, estadoCivil: "casado1titular", dependentes: 2, irsJovem: 0 }
        },
        linhas: [
          { rotulo: "Salário bruto mensal", caso: "d", campo: "bruto" },
          { rotulo: "TSU do trabalhador", caso: "d", campo: "tsu" },
          { rotulo: "Retenção na fonte de IRS", nota: "tabela casado, único titular, 2 dependentes", caso: "d", campo: "retencao" },
          { rotulo: "Salário líquido mensal", caso: "d", campo: "liquido" }
        ],
        comentario: "Dois dependentes reduzem a retenção mensal em cerca de {difMensal:d-a}. Na declaração anual acrescem ainda as deduções fixas por dependente, que atuam sobre a coleta e não sobre o rendimento."
      }
    ],
  "atencao": "se o cônjuge começar a trabalhar durante o ano, a tabela deve ser alterada de imediato junto do empregador. Sem essa comunicação, a retenção fica abaixo do devido durante meses e o acerto anual traduz-se num valor a pagar, por vezes elevado."
},
    tituloSeo: "Salário Líquido Casado com Um Titular 2026 | IRS e TSU",
    descricaoSeo: "Simulador para casais em que só um cônjuge aufere rendimentos: a tabela de retenção mais favorável, com IRS, TSU, dependentes e subsídios em Portugal 2026.",
    label: "Casado (único titular)",
    estadoCivil: "casado1titular",
    dependentes: 0,
    irsJovem: 0,
    descricao: "O regime de casado com único titular aplica-se quando apenas um dos cônjuges aufere rendimentos do trabalho. Esta situação beneficia de tabelas de retenção na fonte mais favoráveis, reconhecendo que um único rendimento sustenta todo o agregado familiar.",
    implicacoesFiscais: "Os trabalhadores casados com único titular beneficiam das taxas de retenção na fonte mais baixas de todas as tabelas. Na declaração anual de IRS, o casal pode optar pela tributação conjunta, onde o rendimento coletável é dividido por dois (quociente conjugal), aplicando-se os escalões de IRS a metade do rendimento e multiplicando o imposto resultante por dois. Este mecanismo resulta numa redução significativa do IRS, especialmente em rendimentos mais elevados. A dedução pessoal e familiar é de 500€ (dois titulares), mais 250€ por cada dependente.",
    conselhosDetalhados: "Se é casado com único titular: (1) Opte sempre pela tributação conjunta na declaração de IRS, pois o quociente conjugal beneficia significativamente quando há grande disparidade de rendimentos; (2) O cônjuge sem rendimentos pode fazer contribuições voluntárias para a Segurança Social para garantir proteção social futura; (3) Ambos os cônjuges devem pedir faturas com NIF para maximizar deduções; (4) Considere o impacto fiscal antes de o cônjuge sem rendimentos iniciar atividade profissional, pois poderá perder o benefício do quociente conjugal.",
    faq: [
      {
        pergunta: "Quanto poupa um casado único titular face a solteiro?",
        resposta: "A poupança depende do nível de rendimento. Para um salário de 1.500€ brutos, a retenção mensal de um casado único titular (9,1%) é bastante inferior à de um solteiro (14,7%), resultando numa poupança mensal de cerca de 84€. Em rendimentos mais elevados, a diferença acentua-se."
      },
      {
        pergunta: "Compensa a tributação conjunta para casados?",
        resposta: "Sim, compensa quase sempre quando apenas um cônjuge tem rendimentos. O quociente conjugal divide o rendimento coletável por dois, aplicando escalões de IRS mais baixos. Quanto maior o rendimento do titular, maior a poupança. Pode simular ambas as opções na declaração de IRS."
      },
      {
        pergunta: "O que acontece se o cônjuge começar a trabalhar?",
        resposta: "Se o cônjuge sem rendimentos iniciar atividade profissional, o agregado passa para o regime de 'Casado, Dois Titulares'. As tabelas de retenção na fonte mudam e a vantagem do quociente conjugal diminui. No entanto, o rendimento total do agregado aumenta, pelo que geralmente compensa."
      }
    ,
      {
        pergunta: "O que acontece se o cônjuge começar a trabalhar a meio do ano?",
        resposta: "A tabela de retenção deve ser alterada assim que a situação muda: passa a aplicar-se a de casado com dois titulares, menos favorável. Se a alteração não for comunicada ao empregador, a retenção fica abaixo do devido durante meses e o acerto anual traduz-se num valor a pagar, por vezes elevado."
      },
      {
        pergunta: "A tributação conjunta é sempre mais vantajosa neste regime?",
        resposta: "Na grande maioria dos casos sim, porque o quociente conjugal divide o rendimento por dois antes de aplicar os escalões, o que faz descer a taxa marginal. A exceção surge quando o titular sem rendimentos do trabalho tem outros rendimentos próprios significativos, caso em que vale a pena simular as duas hipóteses na declaração."
      },
      {
        pergunta: "Os dependentes alteram a tabela de retenção mensal?",
        resposta: "Sim. Existem tabelas distintas consoante o número de dependentes, e cada um reduz a taxa aplicada. A comunicação faz-se ao empregador através da declaração de situação familiar, e deve ser atualizada no ano do nascimento para que o efeito se sinta já no salário e não apenas no acerto."
      },
      {
        pergunta: "Este regime dá direito a alguma dedução adicional?",
        resposta: "Não cria deduções próprias, mas o casal acumula as despesas dos dois na declaração conjunta: saúde, educação, habitação e lares somam-se num único limite. É por isso que a vantagem do regime se mede na declaração anual, e não apenas na retenção mensal."
      }
    ]
  },
  {
    slug: "casado-2-titulares",
    errosFrequentes: [
      "Esperar que as duas retenções somadas correspondam ao imposto do agregado: cada empregador calcula às cegas em relação ao outro.",
      "Escolher a tributação conjunta por hábito sem simular a separada, que pode compensar quando os rendimentos são próximos.",
      "Repartir os dependentes a 50 % na tributação separada sem verificar qual dos dois beneficia mais das deduções correspondentes."
],
    acertoAnual: "É a situação em que o acerto anual reserva mais surpresas, e por uma razão estrutural: cada empregador retém sobre o salário que paga, sem conhecer o rendimento do outro cônjuge. Cada retenção está correta isoladamente, mas a soma pode afastar-se do imposto devido pelo agregado. Com rendimentos desiguais, a tributação conjunta costuma gerar reembolso, porque o quociente conjugal faz descer a taxa marginal. Com rendimentos próximos, vale a pena simular também a tributação separada antes de submeter a declaração.",
    calculo: {
  "intro": "Quando ambos os cônjuges trabalham, cada empregador retém sobre o salário que paga, sem conhecer o rendimento do outro. O cálculo mensal é portanto independente para cada um, e só a declaração anual junta as duas realidades.",
  "etapas": [
    {
      "titulo": "Contribuição para a Segurança Social (TSU)",
      "texto": "Cada cônjuge desconta 11 % sobre o seu próprio salário bruto, sem teto e sem qualquer comunicação entre os dois vínculos."
    },
    {
      "titulo": "Escolha da tabela de retenção",
      "texto": "Aplica-se a tabela «Casado, dois titulares» a cada salário separadamente. Esta tabela é menos favorável do que a de único titular, porque parte do princípio de que o agregado tem duas fontes de rendimento."
    },
    {
      "titulo": "Retenção independente",
      "texto": "É esta independência que explica os acertos anuais surpreendentes em casais com rendimentos muito desiguais: cada retenção é correta isoladamente, mas a soma pode afastar-se do imposto devido pelo agregado."
    },
    {
      "titulo": "Opção pela tributação conjunta ou separada",
      "texto": "Na declaração, o casal escolhe todos os anos. A conjunta aplica o quociente conjugal e costuma compensar quando os rendimentos são desiguais; a separada evita somar deduções num limite comum e pode compensar quando são próximos."
    }
  ],
  exemplos: [
      {
        titulo: "Exemplo: casal com 2 000 € e 1 200 € brutos",
        casos: {
          a: { bruto: 2000, estadoCivil: "casado2titulares", dependentes: 0, irsJovem: 0 },
          b: { bruto: 1200, estadoCivil: "casado2titulares", dependentes: 0, irsJovem: 0 }
        },
        linhas: [
          { rotulo: "Cônjuge A, bruto", caso: "a", campo: "bruto" },
          { rotulo: "Cônjuge A, líquido", nota: "após TSU e retenção", caso: "a", campo: "liquido" },
          { rotulo: "Cônjuge B, bruto", caso: "b", campo: "bruto" },
          { rotulo: "Cônjuge B, líquido", nota: "após TSU e retenção", caso: "b", campo: "liquido" },
          { rotulo: "Rendimento líquido do agregado", soma: ["a", "b"] }
        ],
        comentario: "Com rendimentos desiguais, a tributação conjunta costuma gerar reembolso no acerto: o quociente conjugal faz descer a taxa marginal aplicada ao rendimento somado."
      },
      {
        titulo: "Exemplo: casal com 1 600 € cada",
        casos: { c: { bruto: 1600, estadoCivil: "casado2titulares", dependentes: 0, irsJovem: 0 } },
        linhas: [
          { rotulo: "Cada cônjuge, bruto", caso: "c", campo: "bruto" },
          { rotulo: "Cada cônjuge, líquido", caso: "c", campo: "liquido" },
          { rotulo: "Rendimento líquido do agregado", soma: ["c", "c"] }
        ],
        comentario: "Com rendimentos próximos, o quociente conjugal traz pouca vantagem e vale a pena simular as duas opções: a tributação separada evita repartir um limite comum de deduções por duas pessoas."
      }
    ],
  "atencao": "a escolha entre tributação conjunta e separada é feita todos os anos e não vincula o ano seguinte. Simular as duas hipóteses antes de submeter a declaração é o único modo de saber qual compensa na sua situação concreta."
},
    tituloSeo: "Salário Líquido Casado com Dois Titulares 2026 | IRS, TSU",
    descricaoSeo: "Simulador para casais em que ambos trabalham: cada salário retido em separado, com IRS, TSU e a escolha entre tributação conjunta ou separada em 2026.",
    label: "Casado (dois titulares)",
    estadoCivil: "casado2titulares",
    dependentes: 0,
    irsJovem: 0,
    descricao: "O regime de casado com dois titulares aplica-se quando ambos os cônjuges auferem rendimentos do trabalho. As tabelas de retenção são semelhantes às de solteiro, uma vez que cada cônjuge é tratado individualmente para efeitos de retenção na fonte.",
    implicacoesFiscais: "Nos casados com dois titulares, cada cônjuge aplica a tabela de retenção 'Casado, Dois Titulares' ao seu salário. Estas taxas são geralmente próximas das de solteiro, mas ligeiramente inferiores quando existem dependentes. Na declaração anual, o casal pode optar por tributação separada (cada um declara os seus rendimentos individualmente) ou tributação conjunta (rendimentos somados, divididos por dois). A escolha entre tributação separada e conjunta deve ser avaliada caso a caso, quando os rendimentos dos cônjuges são semelhantes, a tributação separada pode ser mais vantajosa.",
    conselhosDetalhados: "Se é casado com dois titulares: (1) Simule a declaração de IRS tanto em tributação conjunta como separada para determinar qual é mais vantajosa, geralmente, se os rendimentos são próximos, a tributação separada compensa; (2) Distribuam estrategicamente as deduções do agregado (despesas de saúde, educação, etc.) entre ambos os titulares; (3) Com dependentes, verifiquem a quem atribuir os dependentes na tributação separada para maximizar o benefício; (4) Ambos devem pedir faturas com NIF e validar despesas no e-Fatura.",
    faq: [
      {
        pergunta: "Casado dois titulares paga o mesmo que solteiro?",
        resposta: "As taxas de retenção são muito semelhantes, mas não idênticas. Para casados com dois titulares e dependentes, as taxas são ligeiramente inferiores às de solteiro. Sem dependentes, as diferenças são mínimas. A verdadeira diferença surge na declaração anual, conforme se opte por tributação conjunta ou separada."
      },
      {
        pergunta: "Tributação conjunta ou separada: qual compensa mais?",
        resposta: "Depende da diferença de rendimentos entre os cônjuges. Se ambos ganham valores semelhantes, a tributação separada geralmente compensa. Se há grande disparidade (por exemplo, um ganha 3.000€ e o outro 1.000€), a tributação conjunta costuma ser mais vantajosa pelo efeito do quociente conjugal."
      },
      {
        pergunta: "Como funcionam as deduções com dois titulares?",
        resposta: "Na tributação conjunta, as deduções são aplicadas ao agregado como um todo. Na tributação separada, cada cônjuge deduz as suas próprias despesas. A dedução pessoal e familiar de 250€ por titular e por dependente aplica-se em ambos os regimes, mas a distribuição dos dependentes varia."
      }
    ,
      {
        pergunta: "Cada cônjuge é retido sobre o seu próprio salário?",
        resposta: "Sim. Cada empregador aplica a tabela de casado com dois titulares ao salário que paga, sem conhecer o rendimento do outro cônjuge. É esta a razão pela qual um casal com rendimentos muito desiguais pode ter uma retenção conjunta desajustada, corrigida apenas no acerto anual."
      },
      {
        pergunta: "Vale a pena optar pela tributação separada?",
        resposta: "Pode valer quando os dois rendimentos são próximos, porque o quociente conjugal deixa de trazer vantagem e a tributação separada evita somar deduções num limite comum. Quando os rendimentos são desiguais, a conjunta é quase sempre melhor. A opção faz-se todos os anos e não vincula o ano seguinte."
      },
      {
        pergunta: "Como se repartem os dependentes entre os cônjuges?",
        resposta: "Na tributação conjunta não é preciso repartir: os dependentes pertencem ao agregado e as deduções somam-se num limite comum. Na tributação separada, cada dependente é atribuído a um dos progenitores ou repartido a 50%, e essa escolha determina quem beneficia das deduções correspondentes. A repartição declara-se no Portal das Finanças até ao prazo da declaração e vale apenas para esse ano."
      },
      {
        pergunta: "O que muda se um dos dois ficar desempregado?",
        resposta: "A tabela aplicável passa a ser a de casado com único titular, mais favorável, e deve ser comunicada de imediato ao empregador do cônjuge que continua a trabalhar. O subsídio de desemprego não está sujeito a IRS, mas conta para efeitos de determinação do escalão na declaração anual."
      }
    ]
  },
  {
    slug: "irs-jovem",
    errosFrequentes: [
      "Não comunicar a situação ao empregador, o que adia o benefício de um ano inteiro: a isenção só é recuperada na declaração.",
      "Julgar que o benefício reduz a contribuição para a Segurança Social: os 11 % mantêm-se na totalidade, e os anos contam para a pensão.",
      "Contar os anos de benefício como necessariamente seguidos: um ano sem rendimentos do trabalho não consome uma das utilizações."
],
    acertoAnual: "A declaração anual continua obrigatória e é nela que a isenção é confirmada face à retenção efetuada durante o ano. Quem comunicou a situação ao empregador a tempo verá um acerto reduzido; quem não o fez recupera todo o benefício de uma só vez, mas com um ano de atraso. As deduções à coleta aplicam-se normalmente sobre a parte do rendimento que não está isenta, pelo que continua a valer a pena pedir fatura com NIF mesmo nos anos de isenção mais elevada.",
    calculo: {
  "intro": "O IRS Jovem não altera a contribuição para a Segurança Social: age apenas sobre a parte do rendimento sujeita a imposto. Uma percentagem do rendimento do trabalho fica isenta, dentro de um teto, durante um número limitado de anos.",
  "etapas": [
    {
      "titulo": "Contribuição para a Segurança Social (TSU)",
      "texto": "Os 11 % continuam a ser descontados na totalidade. O benefício é exclusivamente fiscal: não há qualquer redução contributiva, e os anos contam integralmente para a carreira contributiva e para a futura pensão."
    },
    {
      "titulo": "Aplicação da isenção",
      "texto": "Uma percentagem do rendimento do trabalho fica isenta de IRS, decrescente ao longo dos anos de benefício, e limitada por um teto expresso em múltiplos do IAS. Acima desse teto, o excedente é tributado normalmente."
    },
    {
      "titulo": "Retenção mensal ajustada",
      "texto": "A isenção reflete-se já na retenção mensal, desde que o trabalhador comunique a situação ao empregador. Sem essa comunicação, a retenção é feita à taxa normal e o benefício só se recupera no acerto anual, com um ano de atraso."
    },
    {
      "titulo": "Acerto na declaração",
      "texto": "A declaração continua obrigatória e é nela que a isenção é confirmada. As deduções à coleta aplicam-se normalmente sobre a parte do rendimento que não está isenta."
    }
  ],
  exemplos: [
      {
        titulo: "Exemplo: 1 400 € brutos, primeiro ano de benefício",
        casos: {
          j: { bruto: 1400, estadoCivil: "solteiro", dependentes: 0, irsJovem: 1 },
          n: { bruto: 1400, estadoCivil: "solteiro", dependentes: 0, irsJovem: 0 }
        },
        linhas: [
          { rotulo: "Salário bruto mensal", caso: "j", campo: "bruto" },
          { rotulo: "TSU do trabalhador", nota: "11 %, sem redução", caso: "j", campo: "tsu" },
          { rotulo: "Retenção sem IRS Jovem", caso: "n", campo: "retencao" },
          { rotulo: "Retenção com IRS Jovem", nota: "isenção do primeiro ano", caso: "j", campo: "retencao" },
          { rotulo: "Salário líquido mensal", caso: "j", campo: "liquido" }
        ],
        comentario: "O ganho mensal ronda os {difMensal:j-n} face à mesma situação sem benefício, ou cerca de {difAnual:j-n} ao ano sobre catorze meses. É o ano em que a isenção é mais elevada."
      },
      {
        titulo: "Exemplo: o mesmo salário num ano posterior",
        casos: {
          j: { bruto: 1400, estadoCivil: "solteiro", dependentes: 0, irsJovem: 1 },
          t: { bruto: 1400, estadoCivil: "solteiro", dependentes: 0, irsJovem: 4 }
        },
        linhas: [
          { rotulo: "Salário bruto mensal", caso: "t", campo: "bruto" },
          { rotulo: "TSU do trabalhador", caso: "t", campo: "tsu" },
          { rotulo: "Retenção com isenção reduzida", nota: "quarto ano de benefício", caso: "t", campo: "retencao" },
          { rotulo: "Salário líquido mensal", caso: "t", campo: "liquido" }
        ],
        comentario: "A percentagem de isenção desce a cada ano de benefício utilizado: entre o primeiro e o quarto ano, a salário constante, o líquido mensal recua cerca de {difMensal:j-t}, até se alinhar com o regime comum."
      }
    ],
  "atencao": "os anos de benefício não têm de ser consecutivos. Se houver um ano sem rendimentos do trabalho, ou passado no estrangeiro, a contagem retoma no ano seguinte com a percentagem que faltava, dentro do limite de idade."
},
    tituloSeo: "Salário Líquido com IRS Jovem 2026 | Simulador e Isenções",
    descricaoSeo: "Simulador do IRS Jovem em 2026: a isenção aplicada ao seu escalão, o efeito na retenção mensal e o que muda no líquido, com TSU e subsídios incluídos.",
    label: "IRS Jovem",
    estadoCivil: "solteiro",
    dependentes: 0,
    irsJovem: 1,
    descricao: "O regime de IRS Jovem é um benefício fiscal destinado a jovens trabalhadores até aos 35 anos, nos primeiros cinco anos de obtenção de rendimentos do trabalho. Este regime permite uma isenção parcial progressiva de IRS, começando em 100% no primeiro ano e diminuindo até 25% no quinto ano.",
    implicacoesFiscais: "O IRS Jovem oferece isenção parcial de imposto nos primeiros 5 anos de atividade profissional: 1.º ano, isenção de 100% (limite de 55×IAS = 28.737,50€); 2.º ano, isenção de 75% (limite de 40×IAS = 20.900€); 3.º e 4.º anos, isenção de 50% (limite de 30×IAS = 15.675€); 5.º ano, isenção de 25% (limite de 20×IAS = 10.450€). O IAS (Indexante dos Apoios Sociais) em 2026 é estimado em 522,50€. Para beneficiar, o jovem deve ter completado pelo menos o ensino secundário (nível 4 do QNQ) e ter até 35 anos.",
    conselhosDetalhados: "Se é jovem trabalhador: (1) Verifique se cumpre os requisitos, idade até 35 anos, qualificação mínima de nível 4 (ensino secundário), e estar nos primeiros 5 anos de obtenção de rendimentos do trabalho; (2) Registe-se no Portal das Finanças e selecione o regime de IRS Jovem; (3) Informe a entidade empregadora para que aplique a taxa de retenção reduzida; (4) Na declaração de IRS, confirme que o benefício está corretamente aplicado; (5) Mesmo com isenção total no 1.º ano, submeta a declaração de IRS para obter reembolso de eventuais retenções.",
    faq: [
      {
        pergunta: "Como é que o IRS Jovem altera o meu salário líquido mensal?",
        resposta: "Podem beneficiar os jovens até 35 anos que estejam nos primeiros 5 anos de obtenção de rendimentos do trabalho (dependente ou independente) e que tenham completado pelo menos o ensino secundário (nível 4 do Quadro Nacional de Qualificações). Não há limite de rendimento para aceder ao regime."
      },
      {
        pergunta: "Quanto poupo com o IRS Jovem no primeiro ano?",
        resposta: "No primeiro ano, a isenção é de 100% do IRS, até ao limite de 55×IAS (28.737,50€ em 2026). Na prática, se o seu IRS anual for inferior a este limite, ficará totalmente isento. Por exemplo, com um salário de 1.500€ brutos, a poupança é de cerca de 2.952,78€ por ano (o IRS anual total)."
      },
      {
        pergunta: "O IRS Jovem aplica-se automaticamente?",
        resposta: "Não é totalmente automático. O trabalhador deve indicar na declaração de IRS que pretende beneficiar do regime e informar a entidade empregadora para que aplique a taxa de retenção reduzida. Caso não informe o empregador, será retido o valor normal e o acerto é feito na declaração anual, resultando num reembolso."
      }
    ,
      {
        pergunta: "Tenho de avisar a empresa para beneficiar do IRS Jovem?",
        resposta: "Tem de ser comunicado. O trabalhador declara ao empregador que reúne as condições, através da declaração de situação familiar, para que a retenção mensal reflita já a isenção. Sem essa comunicação, a retenção é feita à taxa normal e o benefício só se recupera no acerto anual."
      },
      {
        pergunta: "O benefício perde-se se eu mudar de emprego?",
        resposta: "Não. O benefício está ligado ao contribuinte e ao número de anos já usados, não ao contrato. Ao mudar de empregador basta voltar a comunicar a situação, indicando em que ano do benefício se encontra, para que a nova entidade aplique a percentagem correta."
      },
      {
        pergunta: "Posso usar anos não consecutivos?",
        resposta: "Sim. Os anos de benefício não têm de ser seguidos: se houver um ano sem rendimentos do trabalho, ou passado no estrangeiro, a contagem retoma no ano seguinte com a percentagem que faltava. O que conta é o número de anos efetivamente utilizados e o limite de idade."
      },
      {
        pergunta: "O IRS Jovem dispensa a entrega da declaração anual?",
        resposta: "Não. A declaração continua obrigatória, e é nela que a isenção é confirmada e acertada face à retenção feita durante o ano. É também aí que se somam as deduções à coleta, que continuam a aplicar-se normalmente sobre a parte do rendimento não isenta."
      }
    ]
  }
];
