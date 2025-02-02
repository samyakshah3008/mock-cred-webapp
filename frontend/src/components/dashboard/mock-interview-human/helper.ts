const getHeaderTextBasedOnRole = (role: string) => {
  if (role == "allrounder") {
    return "Find people to do mock interviews with based on your tech stack and other preferences. You can practice as an interviewer or an interviewee.";
  } else if (role == "interviewer") {
    return "Find people to do mock interviews with based on your tech stack and other preferences. You can practice as an interviewer.";
  } else {
    return "Find people to do mock interviews with based on your tech stack and other preferences. You can practice as an interviewee.";
  }
};

export { getHeaderTextBasedOnRole };
