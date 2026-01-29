const setProperTeamName = (team) => {
  if (team === "CS") team = "CSE";
    else if (
      team === "MM" ||
        team === "META" ||
        team === "ECE-META" ||
        team === "ECE_META" ||
        team === "ECE+META" ||
        team === "ECE" ||
        team === "EC" ||
        team === "EC_META_EP" ||
        team === "EC+META+EP"
    )
      team = "ECE_META";
      else if (team === "ME" || team === "MECH" || team === "Mech") team = "MECH";
        else if (team === "CE") team = "CIVIL";
          else if (team === "Phd" || team === "phd" || team === "PhD") team = "PHD";
            else if (
              team === "Msc" ||
                team === "MSc" ||
                team === "msc" ||
                team === "msc" ||
                team === "msc-itep" ||
                team === "MSC-ITEP" ||
                team === "MSC+ITEP" ||
                team === "MSC_ITEP" || 
                team === "ITEP"
            )
              team = "MSc_ITEP";
  return team;
};

export default setProperTeamName;
