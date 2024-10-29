const sortOrderStringToNumber = (sortOrder: string) => {
  const sortBy: { [index: string]: number } = {
    asc: 1,
    desc: -1,
  };

  return sortBy[sortOrder];
};

export default {
  sortOrderStringToNumber,
};
