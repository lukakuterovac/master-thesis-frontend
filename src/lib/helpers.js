let navigate = null;
let signOutFunc = null;

export const setNavigate = (nav) => {
  navigate = nav;
};
export const getNavigate = () => navigate;

export const setSignOut = (fn) => {
  signOutFunc = fn;
};
export const getSignOut = () => signOutFunc;

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const toReadableLabel = (str) => {
  if (!str) return "";

  // Replace dashes or underscores with space
  const cleaned = str.replace(/[-_]/g, " ");

  // Capitalize first word
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};
