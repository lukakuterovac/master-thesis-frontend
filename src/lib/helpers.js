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
