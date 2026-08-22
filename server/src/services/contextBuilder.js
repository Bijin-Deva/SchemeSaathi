const schemeStore = require('./schemeStore');

function buildContext(userMessage, language = 'English', userProfile = null) {
  const schemes = schemeStore.searchSchemes(userMessage).slice(0, 5);

  // If no keyword match, take first 5 schemes as fallback
  const contextSchemes = schemes.length > 0 ? schemes : schemeStore.getAllSchemes().slice(0, 5);

  const snippets = contextSchemes
    .map(
      (s) =>
        `Scheme: ${s.name}\nDescription: ${s.description}\nEligibility: age ${s.eligibility_age_min}-${s.eligibility_age_max}, income<${s.eligibility_income_max}, gender:${s.eligibility_gender}, caste:${s.eligibility_caste}\nBenefits: ${s.benefits}`
    )
    .join('\n\n');

  // Build user profile section only if profile data exists
  let profileSection = '';
  if (userProfile && Object.values(userProfile).some((v) => v !== null && v !== undefined && v !== '')) {
    const fields = [];
    if (userProfile.name)           fields.push(`Name: ${userProfile.name}`);
    if (userProfile.age)            fields.push(`Age: ${userProfile.age}`);
    if (userProfile.gender)         fields.push(`Gender: ${userProfile.gender}`);
    if (userProfile.state)          fields.push(`State: ${userProfile.state}`);
    if (userProfile.income)         fields.push(`Annual Income: Rs ${userProfile.income}`);
    if (userProfile.occupation)     fields.push(`Occupation: ${userProfile.occupation}`);
    if (userProfile.caste_category) fields.push(`Caste Category: ${userProfile.caste_category}`);

    profileSection = `
User Profile (use this to personalise your answer — only mention schemes the user is actually eligible for):
${fields.join('\n')}
IMPORTANT: Cross-check every scheme's eligibility criteria against the user profile above before mentioning it. Do NOT suggest schemes the user does not qualify for based on age, gender, income, caste, or state.`;
  } else {
    profileSection = `
No user profile provided. Answer generally, but remind the user they can log in and fill their profile for personalised results.`;
  }

  return `You are SchemeSaathi, a helpful AI assistant for Indian citizens.
Answer ONLY based on the government schemes provided below.
Respond in ${language}. Keep answers simple and jargon-free.
If the answer is not in the schemes below, say you don't have that information.
${profileSection}

Available Schemes:
${snippets}

Privacy: User data is only used for scheme retrieval, never shared.`;
}

module.exports = { buildContext };
