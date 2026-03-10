const displayTeamName = (teamName) => {
  if (!teamName) return teamName;

  if (teamName === "ECE_META") return "ECE_META_EP";
  if (teamName === "MSc_ITEP" || teamName === "MSC_ITEP") {
    return "MSc_ITEP_MNC";
  }

  return teamName;
};

export default displayTeamName;
