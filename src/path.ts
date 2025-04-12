const paths = {
  home: () => '/',
  signin: () => '/signin',
  signout: () => '/',
  signup: () => '/signup',
  forgotPassword: () => '/forgot-password',
  settings: () => `/settings`,                               
  verifyAccount: () => `/verify-account`,
  talks: () => `/talks`,
  talkShow: (talkId: string) => `/talks/${talkId}`,
  talkCreate: () => `/talks/create`,
  talkEdit: (talkId: string) => `/talks/${talkId}/edit`,
};      

export default paths;