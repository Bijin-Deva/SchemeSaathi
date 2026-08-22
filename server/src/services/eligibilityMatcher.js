function matchSchemes(criteria, allSchemes) {
  const { age, gender, state, income, caste } = criteria;
  const results = [];

  for (const scheme of allSchemes) {
    let score = 0;

    if (age !== undefined && age !== null && age !== '') {
      const a = parseInt(age, 10);
      if (a >= scheme.eligibility_age_min && a <= scheme.eligibility_age_max) score++;
    }

    if (gender) {
      if (
        scheme.eligibility_gender.toLowerCase() === 'any' ||
        scheme.eligibility_gender.toLowerCase() === gender.toLowerCase()
      ) score++;
    }

    if (income !== undefined && income !== null && income !== '') {
      if (parseFloat(income) <= scheme.eligibility_income_max) score++;
    }

    if (state) {
      if (
        scheme.state.toLowerCase() === 'national' ||
        scheme.state.toLowerCase() === state.toLowerCase()
      ) score++;
    }

    if (caste) {
      if (
        scheme.eligibility_caste.toLowerCase() === 'any' ||
        scheme.eligibility_caste.toLowerCase() === caste.toLowerCase()
      ) score++;
    }

    if (score > 0) results.push({ ...scheme, matchScore: score });
  }

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = { matchSchemes };
