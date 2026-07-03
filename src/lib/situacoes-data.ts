/**
 * Dados para páginas programáticas por situação fiscal.
 * Cada entrada descreve um tipo de contribuinte e as suas implicações fiscais.
 */

export interface SituacaoEntry {
  slug: string;
  label: string;
  estadoCivil: "solteiro" | "casado1titular" | "casado2titulares";
  dependentes: number;
  irsJovem: number;
  descricao: string;
  implicacoesFiscais: string;
  conselhosDetalhados: string;
  faq: { pergunta: string; resposta: string }[];
}

export const SITUACOES: SituacaoEntry[] = [
  {
    slug: "solteiro",
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
    ]
  },
  {
    slug: "casado-1-titular",
    label: "Casado — Único Titular",
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
        resposta: "Se o cônjuge sem rendimentos iniciar atividade profissional, o agregado passa para o regime de 'Casado — Dois Titulares'. As tabelas de retenção na fonte mudam e a vantagem do quociente conjugal diminui. No entanto, o rendimento total do agregado aumenta, pelo que geralmente compensa."
      }
    ]
  },
  {
    slug: "casado-2-titulares",
    label: "Casado — Dois Titulares",
    estadoCivil: "casado2titulares",
    dependentes: 0,
    irsJovem: 0,
    descricao: "O regime de casado com dois titulares aplica-se quando ambos os cônjuges auferem rendimentos do trabalho. As tabelas de retenção são semelhantes às de solteiro, uma vez que cada cônjuge é tratado individualmente para efeitos de retenção na fonte.",
    implicacoesFiscais: "Nos casados com dois titulares, cada cônjuge aplica a tabela de retenção 'Casado — Dois Titulares' ao seu salário. Estas taxas são geralmente próximas das de solteiro, mas ligeiramente inferiores quando existem dependentes. Na declaração anual, o casal pode optar por tributação separada (cada um declara os seus rendimentos individualmente) ou tributação conjunta (rendimentos somados, divididos por dois). A escolha entre tributação separada e conjunta deve ser avaliada caso a caso — quando os rendimentos dos cônjuges são semelhantes, a tributação separada pode ser mais vantajosa.",
    conselhosDetalhados: "Se é casado com dois titulares: (1) Simule a declaração de IRS tanto em tributação conjunta como separada para determinar qual é mais vantajosa — geralmente, se os rendimentos são próximos, a tributação separada compensa; (2) Distribuam estrategicamente as deduções do agregado (despesas de saúde, educação, etc.) entre ambos os titulares; (3) Com dependentes, verifiquem a quem atribuir os dependentes na tributação separada para maximizar o benefício; (4) Ambos devem pedir faturas com NIF e validar despesas no e-Fatura.",
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
    ]
  },
  {
    slug: "irs-jovem",
    label: "IRS Jovem",
    estadoCivil: "solteiro",
    dependentes: 0,
    irsJovem: 1,
    descricao: "O regime de IRS Jovem é um benefício fiscal destinado a jovens trabalhadores até aos 35 anos, nos primeiros cinco anos de obtenção de rendimentos do trabalho. Este regime permite uma isenção parcial progressiva de IRS, começando em 100% no primeiro ano e diminuindo até 25% no quinto ano.",
    implicacoesFiscais: "O IRS Jovem oferece isenção parcial de imposto nos primeiros 5 anos de atividade profissional: 1.º ano — isenção de 100% (limite de 55×IAS = 28.737,50€); 2.º ano — isenção de 75% (limite de 40×IAS = 20.900€); 3.º e 4.º anos — isenção de 50% (limite de 30×IAS = 15.675€); 5.º ano — isenção de 25% (limite de 20×IAS = 10.450€). O IAS (Indexante dos Apoios Sociais) em 2026 é estimado em 522,50€. Para beneficiar, o jovem deve ter completado pelo menos o ensino secundário (nível 4 do QNQ) e ter até 35 anos.",
    conselhosDetalhados: "Se é jovem trabalhador: (1) Verifique se cumpre os requisitos — idade até 35 anos, qualificação mínima de nível 4 (ensino secundário), e estar nos primeiros 5 anos de obtenção de rendimentos do trabalho; (2) Registe-se no Portal das Finanças e selecione o regime de IRS Jovem; (3) Informe a entidade empregadora para que aplique a taxa de retenção reduzida; (4) Na declaração de IRS, confirme que o benefício está corretamente aplicado; (5) Mesmo com isenção total no 1.º ano, submeta a declaração de IRS para obter reembolso de eventuais retenções.",
    faq: [
      {
        pergunta: "Quem pode beneficiar do IRS Jovem em 2026?",
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
    ]
  }
];
