const generatePath = (projectName) => {
  return projectName.toLowerCase().split(" ").join("-");
};

export { generatePath };
