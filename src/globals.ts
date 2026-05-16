import { brand } from "@/brand";

export const globals = {
  appUrl: brand.siteUrl,
  githubUrl: brand.githubUrl,
  apiGithub: {
    url: "https://ungh.cc/repos/phototourl/5svg",
    fallback: 0,
  },
  twitterUrl: brand.siteUrl,
  sponsorLink: brand.githubUrl,
  /** Set to true to show Submit links (GitHub new issue) */
  enableSubmit: false,
  submitUrl: `${brand.githubUrl}/issues/new/choose`,
  requestSvgUrl: `${brand.githubUrl}/issues/new/choose`,
  registryUrl: `${brand.siteUrl}/r/`,
  v0Url: "https://v0.dev/chat/api/open?url=",
};
