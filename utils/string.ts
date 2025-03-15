const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (err: unknown) {
    console.warn(err);
    return false;
  }
};

export { isValidURL };
