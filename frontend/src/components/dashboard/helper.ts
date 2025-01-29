const getHeaderTextBasedOnRole = (role: string) => {
  if (role === "interviewer") {
    return "Build a strong proof of work by helping others with taking their mock interviews, and showcase their testimonials online!";
  } else if (role === "interviewee") {
    return "Prepare yourself best by practicing mock interviews to confidently appear in real interviews! 🚀";
  } else {
    return "Prepare yourself best by practicing mock interviews to confidently appear in real interviews! 🚀 or be helpful in community by taking someone's mock interview! 🙏";
  }
};

export { getHeaderTextBasedOnRole };
