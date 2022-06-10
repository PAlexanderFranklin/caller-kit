import {
  IdentityDAC,
  ProfileDAC,
  SocialDAC,
  FeedDAC,
  QueryDAC,
} from "skynet-dacs-library";

const identityDAC = new IdentityDAC();
const profileDAC = new ProfileDAC();
const socialDAC = new SocialDAC();
const feedDAC = new FeedDAC();
const queryDAC = new QueryDAC();

export const createCall = (call) => {
  const { title, text, duration, variantOf } = call;
  feedDAC.createPost({title, text, ext: {dance: {duration, variantOf}, license: "CC0"}});
}