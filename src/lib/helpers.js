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
