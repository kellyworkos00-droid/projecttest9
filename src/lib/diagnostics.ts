export const DIAGNOSTIC_QUESTIONS = {
  cashflow: [
    {
      id: 'cf1',
      question: 'Do you track your business income and expenses regularly?',
      questionSw: 'Je, unafuatilia mapato na matumizi ya biashara yako mara kwa mara?',
      type: 'radio',
      options: [
        { value: 'daily', label: 'Daily / Kila siku', score: 10 },
        { value: 'weekly', label: 'Weekly / Kila wiki', score: 7 },
        { value: 'monthly', label: 'Monthly / Kila mwezi', score: 4 },
        { value: 'rarely', label: 'Rarely or never / Mara chache au kamwe', score: 0 },
      ],
    },
    {
      id: 'cf2',
      question: 'Do you know your monthly profit margin?',
      questionSw: 'Je, unajua faida yako ya kila mwezi?',
      type: 'radio',
      options: [
        { value: 'yes-exact', label: 'Yes, I track it precisely / Ndio, ninafuatilia kwa usahihi', score: 10 },
        { value: 'yes-estimate', label: 'Yes, rough estimate / Ndio, makadirio tu', score: 5 },
        { value: 'no', label: 'No / Hapana', score: 0 },
      ],
    },
    {
      id: 'cf3',
      question: 'How often do you run out of cash to pay suppliers or staff?',
      questionSw: 'Mara ngapi hukosa pesa kulipa wasambazaji au wafanyakazi?',
      type: 'radio',
      options: [
        { value: 'never', label: 'Never / Kamwe', score: 10 },
        { value: 'rarely', label: 'Rarely (1-2 times/year) / Mara chache (1-2 mara kwa mwaka)', score: 7 },
        { value: 'sometimes', label: 'Sometimes (monthly) / Wakati mwingine (kila mwezi)', score: 3 },
        { value: 'often', label: 'Often (weekly) / Mara nyingi (kila wiki)', score: 0 },
      ],
    },
    {
      id: 'cf4',
      question: 'Do you separate personal and business money?',
      questionSw: 'Je, unatenganisha pesa za binafsi na za biashara?',
      type: 'radio',
      options: [
        { value: 'yes-separate', label: 'Yes, completely separate / Ndio, kabisa', score: 10 },
        { value: 'mostly', label: 'Mostly separate / Mara nyingi', score: 5 },
        { value: 'no', label: 'No, mixed together / Hapana, zimechanganyika', score: 0 },
      ],
    },
    {
      id: 'cf5',
      question: 'Do you have a cash reserve for emergencies?',
      questionSw: 'Je, una akiba ya pesa kwa dharura?',
      type: 'radio',
      options: [
        { value: '3months', label: '3+ months expenses / Matumizi ya miezi 3+', score: 10 },
        { value: '1month', label: '1 month expenses / Matumizi ya mwezi 1', score: 7 },
        { value: 'some', label: 'Some savings / Akiba kidogo', score: 3 },
        { value: 'none', label: 'No reserve / Hakuna akiba', score: 0 },
      ],
    },
  ],
  compliance: [
    {
      id: 'co1',
      question: 'Is your business registered with the relevant authorities?',
      questionSw: 'Je, biashara yako imesajiliwa na mamlaka husika?',
      type: 'radio',
      options: [
        { value: 'yes-all', label: 'Yes, fully registered / Ndio, imesajiliwa kikamilifu', score: 10 },
        { value: 'partial', label: 'Partially registered / Imesajiliwa kiasi', score: 5 },
        { value: 'no', label: 'Not registered / Haijasajiliwa', score: 0 },
      ],
    },
    {
      id: 'co2',
      question: 'Do you have a KRA PIN?',
      questionSw: 'Je, una KRA PIN?',
      type: 'radio',
      options: [
        { value: 'yes', label: 'Yes / Ndio', score: 10 },
        { value: 'no', label: 'No / Hapana', score: 0 },
      ],
    },
    {
      id: 'co3',
      question: 'Are you registered for eTIMS (electronic tax invoicing)?',
      questionSw: 'Je, umesajiliwa kwa eTIMS (ankara za kodi za kielektroniki)?',
      type: 'radio',
      options: [
        { value: 'yes-using', label: 'Yes, and using it / Ndio, na ninatumia', score: 10 },
        { value: 'yes-not-using', label: 'Yes, but not using / Ndio, lakini situmii', score: 5 },
        { value: 'no', label: 'No / Hapana', score: 0 },
      ],
    },
    {
      id: 'co4',
      question: 'Do you file tax returns on time?',
      questionSw: 'Je, unawasilisha kodi kwa wakati?',
      type: 'radio',
      options: [
        { value: 'always', label: 'Always / Kila wakati', score: 10 },
        { value: 'sometimes', label: 'Sometimes late / Wakati mwingine chelewa', score: 5 },
        { value: 'rarely', label: 'Rarely or never / Mara chache au kamwe', score: 0 },
      ],
    },
    {
      id: 'co5',
      question: 'Do you have required county/municipal licenses?',
      questionSw: 'Je, una leseni zinazohitajika za kaunti/manispaa?',
      type: 'radio',
      options: [
        { value: 'yes-current', label: 'Yes, all current / Ndio, zote za sasa', score: 10 },
        { value: 'some', label: 'Some licenses / Leseni zingine', score: 5 },
        { value: 'no', label: 'No licenses / Hakuna leseni', score: 0 },
      ],
    },
  ],
};

export function calculateDiagnosticScore(responses: Record<string, string>, domain: string): number {
  const questions = DIAGNOSTIC_QUESTIONS[domain as keyof typeof DIAGNOSTIC_QUESTIONS];
  if (!questions) return 0;

  let totalScore = 0;
  let maxScore = 0;

  questions.forEach((q) => {
    const response = responses[q.id];
    const option = q.options.find((opt) => opt.value === response);
    if (option) {
      totalScore += option.score;
    }
    maxScore += Math.max(...q.options.map((opt) => opt.score));
  });

  return Math.round((totalScore / maxScore) * 100);
}

export function generateActionPlan(responses: Record<string, string>, domain: string, score: number) {
  if (domain === 'cashflow') {
    const actions = [];

    if (!responses.cf1 || responses.cf1 === 'rarely') {
      actions.push({
        title: 'Start Daily Income & Expense Tracking',
        titleSw: 'Anza Kufuatilia Mapato na Matumizi Kila Siku',
        description: 'Use a simple notebook or spreadsheet to record every transaction.',
        descriptionSw: 'Tumia daftari au spreadsheet ya rahisi kurekodi kila muamala.',
        effort: 'low',
        impact: 'high',
        playbookSlug: 'cashflow-basics',
      });
    }

    if (responses.cf4 === 'no') {
      actions.push({
        title: 'Open a Separate Business Account',
        titleSw: 'Fungua Akaunti Tofauti ya Biashara',
        description: 'Separate your personal and business finances for clarity.',
        descriptionSw: 'Tenganisha fedha zako za binafsi na za biashara kwa uwazi.',
        effort: 'medium',
        impact: 'high',
        playbookSlug: 'business-banking',
      });
    }

    if (responses.cf5 === 'none' || responses.cf5 === 'some') {
      actions.push({
        title: 'Build an Emergency Fund',
        titleSw: 'Jenga Mfuko wa Dharura',
        description: 'Save 10% of profits monthly until you have 3 months of expenses.',
        descriptionSw: 'Weka akiba ya 10% ya faida kila mwezi hadi upate matumizi ya miezi 3.',
        effort: 'medium',
        impact: 'high',
        playbookSlug: 'emergency-fund',
      });
    }

    return actions;
  }

  if (domain === 'compliance') {
    const actions = [];

    if (responses.co2 === 'no') {
      actions.push({
        title: 'Register for KRA PIN',
        titleSw: 'Sajili KRA PIN',
        description: 'Apply online at iTax portal - takes 1-3 days.',
        descriptionSw: 'Omba kwenye wavuti ya iTax - inachukua siku 1-3.',
        effort: 'low',
        impact: 'critical',
        playbookSlug: 'kra-pin-registration',
      });
    }

    if (responses.co3 === 'no' || responses.co3 === 'yes-not-using') {
      actions.push({
        title: 'Set Up eTIMS for Tax Invoicing',
        titleSw: 'Weka eTIMS kwa Ankara za Kodi',
        description: 'Register and configure your electronic tax invoicing system.',
        descriptionSw: 'Sajili na sanidi mfumo wako wa ankara za kodi za kielektroniki.',
        effort: 'medium',
        impact: 'critical',
        playbookSlug: 'etims-setup',
      });
    }

    if (responses.co5 === 'no' || responses.co5 === 'some') {
      actions.push({
        title: 'Get County Business Permits',
        titleSw: 'Pata Vibali vya Biashara vya Kaunti',
        description: 'Visit your county offices to apply for required licenses.',
        descriptionSw: 'Tembelea ofisi za kaunti yako kuomba leseni zinazohitajika.',
        effort: 'medium',
        impact: 'high',
        playbookSlug: 'county-permits',
      });
    }

    return actions;
  }

  return [];
}
