/**
 * Dados pré-calculados para páginas programáticas de salário bruto → líquido.
 * Valores calculados com base no motor engine.ts para solteiro, 0 dependentes, sem IRS Jovem.
 */

export interface SalarioEntry {
  slug: string;
  brutoMensal: number;
  liquidoMensal: number;
  tsuTrabalhador: number;
  retencaoMensal: number;
  retencaoTaxa: number;
  irsAnual: number;
  liquidoAnual: number;
  custoEmpregadorMensal: number;
  descricao: string;
  contexto: string;
  faq: { pergunta: string; resposta: string }[];
}

export const SALARIOS: SalarioEntry[] = [
  {
    slug: "820",
    brutoMensal: 820,
    liquidoMensal: 729.80,
    tsuTrabalhador: 90.20,
    retencaoMensal: 0,
    retencaoTaxa: 0,
    irsAnual: 977.32,
    liquidoAnual: 10138.76,
    custoEmpregadorMensal: 1014.75,
    descricao: "O salário de 820€ brutos mensais situa-se ligeiramente abaixo do salário mínimo nacional de 2026 (870€). É um valor de referência para contratos a tempo parcial ou situações especiais. A este nível salarial, não há retenção na fonte de IRS.",
    contexto: "Com um salário bruto de 820€, o trabalhador recebe aproximadamente 729,80€ líquidos por mês. O único desconto aplicável é a contribuição para a Segurança Social (TSU) de 11%, que corresponde a 90,20€ mensais. Este valor está isento de retenção na fonte de IRS, o que significa que todo o rendimento após TSU chega à conta bancária do trabalhador.",
    faq: [
      {
        pergunta: "Um salário de 820€ brutos paga IRS?",
        resposta: "Não. Com um salário bruto mensal de 820€, o trabalhador está isento de retenção na fonte de IRS. O único desconto obrigatório é a contribuição para a Segurança Social de 11% (90,20€), ficando com um líquido mensal de 729,80€."
      },
      {
        pergunta: "Quanto desconta de Segurança Social com 820€ brutos?",
        resposta: "A contribuição do trabalhador para a Segurança Social é de 11% do salário bruto, o que corresponde a 90,20€ por mês. A entidade empregadora paga adicionalmente 23,75% (194,75€)."
      },
      {
        pergunta: "Qual o custo total para a empresa de um salário de 820€?",
        resposta: "O custo mensal para o empregador é de 1.014,75€ (820€ de salário bruto + 194,75€ de TSU patronal). Anualmente, considerando 14 meses, o custo total é de 14.206,50€."
      }
    ]
  },
  {
    slug: "1000",
    brutoMensal: 1000,
    liquidoMensal: 818.00,
    tsuTrabalhador: 110.00,
    retencaoMensal: 72.00,
    retencaoTaxa: 0.072,
    irsAnual: 1415.39,
    liquidoAnual: 11410.41,
    custoEmpregadorMensal: 1237.50,
    descricao: "Um salário bruto de 1.000€ mensais é um valor comum em Portugal, especialmente para posições de entrada ou a tempo inteiro com pouca experiência. Após descontos, o trabalhador solteiro sem dependentes recebe cerca de 818€ líquidos.",
    contexto: "Com 1.000€ brutos mensais, os descontos incluem 110€ de Segurança Social (11%) e 72€ de retenção na fonte de IRS (7,2%). O salário líquido mensal resultante é de 818€. Anualmente, incluindo subsídios de Natal e férias, o rendimento líquido total atinge aproximadamente 11.410€.",
    faq: [
      {
        pergunta: "Quanto recebo de líquido com 1.000€ brutos?",
        resposta: "Com um salário bruto de 1.000€ mensais, um trabalhador solteiro sem dependentes recebe aproximadamente 818€ líquidos por mês. Os descontos incluem 110€ de TSU (11%) e 72€ de retenção na fonte de IRS (7,2%)."
      },
      {
        pergunta: "Qual a taxa de retenção de IRS para 1.000€ brutos?",
        resposta: "Para um trabalhador solteiro sem dependentes, a taxa de retenção na fonte é de 7,2%. Isto significa que são retidos 72€ por mês a título de IRS. Se tiver dependentes, a taxa poderá ser inferior."
      },
      {
        pergunta: "Qual o líquido anual com 1.000€ brutos mensais?",
        resposta: "O rendimento líquido anual, incluindo os 12 meses de vencimento mais os subsídios de Natal e férias, é de aproximadamente 11.410,41€."
      }
    ]
  },
  {
    slug: "1200",
    brutoMensal: 1200,
    liquidoMensal: 921.60,
    tsuTrabalhador: 132.00,
    retencaoMensal: 146.40,
    retencaoTaxa: 0.122,
    irsAnual: 1974.04,
    liquidoAnual: 12890.37,
    custoEmpregadorMensal: 1485.00,
    descricao: "O salário de 1.200€ brutos é frequente em funções administrativas, comércio e serviços em Portugal. Representa um valor acima do salário mínimo, com uma taxa de retenção de IRS de 12,2% para solteiros sem dependentes.",
    contexto: "Com 1.200€ brutos, o trabalhador solteiro sem dependentes recebe 921,60€ líquidos mensais. Os descontos mensais incluem 132€ de TSU e 146,40€ de retenção na fonte. O líquido anual, com subsídios, atinge cerca de 12.890€.",
    faq: [
      {
        pergunta: "Quanto fica de líquido com 1.200€ brutos em 2026?",
        resposta: "Um trabalhador solteiro sem dependentes com 1.200€ brutos recebe aproximadamente 921,60€ líquidos por mês em 2026. São descontados 132€ de TSU (11%) e 146,40€ de IRS (12,2%)."
      },
      {
        pergunta: "Os 1.200€ brutos incluem subsídio de alimentação?",
        resposta: "Não. O salário bruto de 1.200€ refere-se apenas à retribuição base mensal. O subsídio de alimentação é um complemento separado, normalmente pago em cartão refeição (isento de impostos até 10,20€/dia) ou em dinheiro (tributado acima de 6,00€/dia)."
      },
      {
        pergunta: "Qual a diferença entre 1.200€ brutos e líquidos?",
        resposta: "A diferença é de 278,40€ mensais. De 1.200€ brutos, são descontados 132€ de Segurança Social e 146,40€ de retenção na fonte de IRS, resultando em 921,60€ líquidos."
      }
    ]
  },
  {
    slug: "1500",
    brutoMensal: 1500,
    liquidoMensal: 1114.50,
    tsuTrabalhador: 165.00,
    retencaoMensal: 220.50,
    retencaoTaxa: 0.147,
    irsAnual: 2952.78,
    liquidoAnual: 15586.52,
    custoEmpregadorMensal: 1856.25,
    descricao: "Um salário de 1.500€ brutos mensais é um valor de referência importante em Portugal, correspondendo a cerca de 1,7 vezes o salário mínimo. É comum em funções técnicas, profissionais qualificados e quadros intermédios.",
    contexto: "Com 1.500€ brutos, o trabalhador solteiro recebe 1.114,50€ líquidos mensais, após descontos de 165€ de TSU e 220,50€ de retenção na fonte (14,7%). O custo total para o empregador é de 1.856,25€ mensais.",
    faq: [
      {
        pergunta: "Quanto recebo líquido com um salário de 1.500€ brutos?",
        resposta: "Com 1.500€ brutos mensais, um trabalhador solteiro sem dependentes recebe aproximadamente 1.114,50€ líquidos. Os descontos totalizam 385,50€: 165€ de TSU (11%) e 220,50€ de retenção de IRS (14,7%)."
      },
      {
        pergunta: "Quanto custa à empresa um funcionário com 1.500€ brutos?",
        resposta: "O custo mensal total para o empregador é de 1.856,25€ (1.500€ brutos + 356,25€ de TSU patronal a 23,75%). Anualmente, incluindo 14 meses, o custo ascende a 25.987,50€."
      },
      {
        pergunta: "Qual o IRS anual com 1.500€ brutos mensais?",
        resposta: "O IRS anual estimado para um trabalhador solteiro sem dependentes com 1.500€ brutos mensais é de aproximadamente 2.952,78€, o que corresponde a uma taxa efetiva de cerca de 14%."
      }
    ]
  },
  {
    slug: "1800",
    brutoMensal: 1800,
    liquidoMensal: 1299.60,
    tsuTrabalhador: 198.00,
    retencaoMensal: 302.40,
    retencaoTaxa: 0.168,
    irsAnual: 4044.78,
    liquidoAnual: 18172.18,
    custoEmpregadorMensal: 2227.50,
    descricao: "O salário de 1.800€ brutos posiciona-se acima da média salarial portuguesa. É típico de profissionais com experiência, funções técnicas especializadas ou cargos de supervisão.",
    contexto: "Com 1.800€ brutos, o trabalhador solteiro recebe 1.299,60€ líquidos após descontos de 198€ de TSU e 302,40€ de retenção na fonte (16,8%). O rendimento líquido anual, com subsídios, é de aproximadamente 18.172€.",
    faq: [
      {
        pergunta: "Qual o salário líquido mensal de 1.800€ brutos?",
        resposta: "Um trabalhador solteiro sem dependentes com 1.800€ brutos recebe 1.299,60€ líquidos por mês. A retenção na fonte é de 16,8% (302,40€) e a TSU é de 11% (198€)."
      },
      {
        pergunta: "Quanto pago de IRS com 1.800€ brutos?",
        resposta: "A retenção mensal na fonte é de 302,40€ (16,8%). Anualmente, o IRS estimado é de cerca de 4.044,78€. O valor final do imposto é apurado na declaração anual de IRS."
      },
      {
        pergunta: "Quanto recebo de subsídio de Natal com 1.800€ brutos?",
        resposta: "O subsídio de Natal bruto é de 1.800€. Após descontos de TSU (198€) e IRS à taxa média, o valor líquido do subsídio de Natal é de aproximadamente 1.460€."
      }
    ]
  },
  {
    slug: "2000",
    brutoMensal: 2000,
    liquidoMensal: 1402.00,
    tsuTrabalhador: 220.00,
    retencaoMensal: 378.00,
    retencaoTaxa: 0.189,
    irsAnual: 5946.42,
    liquidoAnual: 19528.76,
    custoEmpregadorMensal: 2475.00,
    descricao: "Um salário de 2.000€ brutos mensais é um marco importante para muitos trabalhadores portugueses. Corresponde a mais do dobro do salário mínimo e é comum em quadros médios, profissões liberais e setores especializados.",
    contexto: "Com 2.000€ brutos, o trabalhador solteiro recebe 1.402€ líquidos mensais. A taxa de retenção na fonte sobe para 18,9%, com 378€ retidos mensalmente. O custo total para o empregador atinge 2.475€ por mês.",
    faq: [
      {
        pergunta: "Quanto fica de líquido com 2.000€ brutos em Portugal?",
        resposta: "Com um salário bruto de 2.000€, um trabalhador solteiro sem dependentes recebe aproximadamente 1.402€ líquidos por mês. Os descontos incluem 220€ de TSU (11%) e 378€ de retenção de IRS (18,9%)."
      },
      {
        pergunta: "Qual a percentagem de descontos sobre 2.000€ brutos?",
        resposta: "Os descontos totais representam cerca de 29,9% do salário bruto: 11% para a Segurança Social (220€) e 18,9% para retenção na fonte de IRS (378€). Ao todo, são descontados 598€ mensais."
      },
      {
        pergunta: "Compensa pedir aumento de 1.500€ para 2.000€ brutos?",
        resposta: "Sim. Apesar de a taxa de retenção subir de 14,7% para 18,9%, o ganho líquido mensal é de 287,50€ (de 1.114,50€ para 1.402€). Num aumento de 500€ brutos, recebe efetivamente mais 287,50€ líquidos por mês."
      }
    ]
  },
  {
    slug: "2500",
    brutoMensal: 2500,
    liquidoMensal: 1690.00,
    tsuTrabalhador: 275.00,
    retencaoMensal: 535.00,
    retencaoTaxa: 0.214,
    irsAnual: 8396.80,
    liquidoAnual: 23521.10,
    custoEmpregadorMensal: 3093.75,
    descricao: "O salário de 2.500€ brutos mensais coloca o trabalhador acima da média nacional. É um valor típico de quadros superiores, profissionais de tecnologia, engenharia e gestão em Portugal.",
    contexto: "Com 2.500€ brutos, o líquido mensal é de 1.690€ para um solteiro sem dependentes, após descontos de 275€ de TSU e 535€ de retenção na fonte (21,4%). O rendimento líquido anual atinge cerca de 23.521€.",
    faq: [
      {
        pergunta: "Quanto recebo líquido com 2.500€ brutos mensais?",
        resposta: "Um trabalhador solteiro sem dependentes recebe aproximadamente 1.690€ líquidos por mês com um salário bruto de 2.500€. Os descontos são de 275€ (TSU) e 535€ (IRS, taxa de 21,4%)."
      },
      {
        pergunta: "Qual o escalão de IRS para 2.500€ brutos?",
        resposta: "Com um rendimento bruto anual de 35.000€ (14 meses), após dedução específica, o rendimento coletável situa-se no 6.º escalão de IRS (taxa marginal de 37%). Contudo, a taxa efetiva é bastante inferior."
      },
      {
        pergunta: "Quanto é o líquido anual incluindo subsídios?",
        resposta: "O rendimento líquido anual com 2.500€ brutos, incluindo os subsídios de Natal e férias (líquidos de descontos), é de aproximadamente 23.521,10€."
      }
    ]
  },
  {
    slug: "3000",
    brutoMensal: 3000,
    liquidoMensal: 1941.00,
    tsuTrabalhador: 330.00,
    retencaoMensal: 729.00,
    retencaoTaxa: 0.243,
    irsAnual: 10795.88,
    liquidoAnual: 27036.56,
    custoEmpregadorMensal: 3712.50,
    descricao: "Um salário de 3.000€ brutos é considerado elevado em Portugal, correspondendo a mais de 3 vezes o salário mínimo. É habitual em cargos de direção, consultoria, TI sénior e profissões altamente qualificadas.",
    contexto: "Com 3.000€ brutos, o trabalhador solteiro recebe 1.941€ líquidos mensais. A retenção na fonte sobe para 24,3% (729€) e a TSU mantém-se em 11% (330€). O custo para o empregador é de 3.712,50€ por mês.",
    faq: [
      {
        pergunta: "Qual o salário líquido de 3.000€ brutos em 2026?",
        resposta: "Com 3.000€ brutos mensais, um trabalhador solteiro sem dependentes recebe aproximadamente 1.941€ líquidos. Os descontos totalizam 1.059€: 330€ de TSU e 729€ de retenção na fonte (24,3%)."
      },
      {
        pergunta: "Quanto pago de impostos com 3.000€ brutos?",
        resposta: "A retenção mensal na fonte é de 729€ (24,3%). Anualmente, o IRS estimado é de 10.795,88€. Somando a TSU anual de 4.620€, os descontos totais anuais rondam os 15.416€."
      },
      {
        pergunta: "Qual o custo para a empresa de 3.000€ brutos?",
        resposta: "O custo mensal total para o empregador é de 3.712,50€ (3.000€ + 712,50€ de TSU patronal). Anualmente, o custo ascende a 51.975€, incluindo 14 meses."
      }
    ]
  },
  {
    slug: "3500",
    brutoMensal: 3500,
    liquidoMensal: 2152.50,
    tsuTrabalhador: 385.00,
    retencaoMensal: 962.50,
    retencaoTaxa: 0.275,
    irsAnual: 13351.02,
    liquidoAnual: 30025.99,
    custoEmpregadorMensal: 4331.25,
    descricao: "O salário de 3.500€ brutos coloca o trabalhador no topo da distribuição salarial portuguesa. É frequente em cargos de gestão sénior, direção e especialidades muito procuradas como medicina, engenharia e tecnologia.",
    contexto: "Com 3.500€ brutos, o líquido mensal é de 2.152,50€ após descontos de 385€ de TSU e 962,50€ de retenção na fonte (27,5%). O rendimento líquido anual, incluindo subsídios, atinge cerca de 30.026€.",
    faq: [
      {
        pergunta: "Quanto recebo líquido com 3.500€ brutos?",
        resposta: "Um trabalhador solteiro sem dependentes recebe 2.152,50€ líquidos por mês com um salário de 3.500€ brutos. A taxa de retenção na fonte é de 27,5%, resultando em descontos totais de 1.347,50€."
      },
      {
        pergunta: "Quantos por cento desconto com 3.500€ brutos?",
        resposta: "Os descontos totalizam 38,5% do salário bruto: 11% de TSU (385€) e 27,5% de retenção na fonte de IRS (962,50€). Fica com 61,5% do valor bruto."
      },
      {
        pergunta: "Compensa negociar benefícios em vez de aumento?",
        resposta: "Com uma taxa marginal de retenção de 27,5%, cada euro adicional de salário bruto rende cerca de 61,5 cêntimos líquidos. Benefícios como seguro de saúde, cartão refeição ou contribuições para PPR podem ser fiscalmente mais eficientes."
      }
    ]
  },
  {
    slug: "4000",
    brutoMensal: 4000,
    liquidoMensal: 2340.00,
    tsuTrabalhador: 440.00,
    retencaoMensal: 1220.00,
    retencaoTaxa: 0.305,
    irsAnual: 16061.07,
    liquidoAnual: 32690.99,
    custoEmpregadorMensal: 4950.00,
    descricao: "Um salário de 4.000€ brutos mensais é considerado muito elevado no contexto português, situando-se no top 10% dos rendimentos. É típico de diretores, gestores sénior, médicos especialistas e profissionais de TI altamente qualificados.",
    contexto: "Com 4.000€ brutos, o trabalhador solteiro recebe 2.340€ líquidos mensais. A retenção na fonte atinge 30,5% (1.220€) e a TSU é de 440€. O custo para o empregador sobe para 4.950€ mensais.",
    faq: [
      {
        pergunta: "Qual o líquido de 4.000€ brutos em Portugal?",
        resposta: "Com 4.000€ brutos, um trabalhador solteiro sem dependentes recebe 2.340€ líquidos mensais. Os descontos totais são de 1.660€: 440€ de TSU e 1.220€ de retenção na fonte (30,5%)."
      },
      {
        pergunta: "Quanto pago de IRS com 4.000€ brutos?",
        resposta: "O IRS anual estimado é de 16.061,07€. A retenção mensal na fonte é de 1.220€ (30,5%). Na declaração anual, o valor retido é confrontado com o imposto efetivamente devido."
      },
      {
        pergunta: "Como reduzir impostos com salário de 4.000€?",
        resposta: "As principais estratégias incluem: maximizar deduções (saúde, educação, habitação), ter dependentes no agregado familiar, contribuir para PPR, e verificar se é elegível para o IRS Jovem. Consulte um contabilista para otimizar a sua situação fiscal."
      }
    ]
  },
  {
    slug: "5000",
    brutoMensal: 5000,
    liquidoMensal: 2775.00,
    tsuTrabalhador: 550.00,
    retencaoMensal: 1675.00,
    retencaoTaxa: 0.335,
    irsAnual: 21635.40,
    liquidoAnual: 38788.61,
    custoEmpregadorMensal: 6187.50,
    descricao: "O salário de 5.000€ brutos mensais coloca o trabalhador entre os rendimentos mais elevados em Portugal. É habitual em cargos de direção executiva, profissões altamente especializadas e setores como banca, farmacêutica e tecnologia.",
    contexto: "Com 5.000€ brutos, o trabalhador solteiro recebe 2.775€ líquidos mensais, com uma taxa de retenção de 33,5%. Os descontos mensais totalizam 2.225€ (550€ de TSU + 1.675€ de IRS). O custo para o empregador é de 6.187,50€ por mês.",
    faq: [
      {
        pergunta: "Quanto recebo líquido com 5.000€ brutos?",
        resposta: "Com um salário de 5.000€ brutos, um trabalhador solteiro sem dependentes recebe aproximadamente 2.775€ líquidos por mês. Isto representa 55,5% do valor bruto, sendo descontados 44,5% entre TSU e IRS."
      },
      {
        pergunta: "Qual o escalão de IRS para 5.000€ brutos?",
        resposta: "Com um rendimento bruto anual de 70.000€ (14 meses), após dedução específica, o rendimento coletável situa-se no 8.º escalão de IRS (taxa marginal de 45%). A taxa efetiva, no entanto, é substancialmente inferior."
      },
      {
        pergunta: "Qual o líquido anual com 5.000€ brutos?",
        resposta: "O rendimento líquido anual, incluindo os subsídios de Natal e férias após descontos, é de aproximadamente 38.788,61€. O custo anual total para o empregador é de 86.625€."
      }
    ]
  },
  {
    slug: "7000",
    brutoMensal: 7000,
    liquidoMensal: 3640.00,
    tsuTrabalhador: 770.00,
    retencaoMensal: 2590.00,
    retencaoTaxa: 0.370,
    irsAnual: 33030.03,
    liquidoAnual: 50899.11,
    custoEmpregadorMensal: 8662.50,
    descricao: "O salário de 7.000€ brutos mensais representa o topo da pirâmide salarial portuguesa. É típico de CEO, diretores-gerais, parceiros de escritórios de advogados, médicos especialistas em prática privada e profissionais de tecnologia em multinacionais.",
    contexto: "Com 7.000€ brutos, o trabalhador solteiro recebe 3.640€ líquidos mensais. A retenção na fonte atinge 37% (2.590€) e a TSU é de 770€. Os descontos totais representam 48% do salário bruto. O custo para o empregador é de 8.662,50€ por mês.",
    faq: [
      {
        pergunta: "Quanto recebo líquido com 7.000€ brutos?",
        resposta: "Com 7.000€ brutos mensais, um trabalhador solteiro sem dependentes recebe 3.640€ líquidos. Os descontos totalizam 3.360€ por mês: 770€ de TSU (11%) e 2.590€ de retenção na fonte (37%)."
      },
      {
        pergunta: "Qual a taxa efetiva de IRS com 7.000€ brutos?",
        resposta: "O IRS anual estimado é de 33.030,03€ sobre um rendimento bruto anual de 98.000€ (14 meses), resultando numa taxa efetiva de aproximadamente 33,7%. A taxa de retenção na fonte é de 37%."
      },
      {
        pergunta: "Quanto custa 7.000€ brutos ao empregador?",
        resposta: "O custo mensal total para a empresa é de 8.662,50€ (7.000€ + 1.662,50€ de TSU patronal). Anualmente, o custo atinge 121.275€, incluindo 14 meses."
      }
    ]
  }
];
