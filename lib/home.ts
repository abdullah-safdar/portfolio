import homeData from "@/content/home.json";

/**
 * Home page content, edited via the Tina `home` singleton at `/admin`
 * (see tina/config.ts) and read here with a direct JSON import -- the
 * home page is a server component with zero client JS, so there is no
 * reason to route through Tina's GraphQL client at request time.
 */

export type CapabilityShape =
  | "frontend"
  | "backend"
  | "distributed"
  | "cloud"
  | "ai"
  | "web3";

export type HomeData = {
  hero: {
    kicker: string;
    intro: string;
    github: string;
    linkedin: string;
  };
  ticker: string[];
  stats: {
    idx: string;
    tag: string;
    n: string;
    unit: string;
    bar: string;
    label: string;
  }[];
  projects: {
    num: string;
    name: string;
    flow: { n: string; a?: boolean }[];
    path: string;
    year: string;
    metric: string;
    blurb: string;
    tags: string[];
  }[];
  caps: {
    idx: string;
    shape: CapabilityShape;
    label: string;
    note: string;
  }[];
  skillGroups: { title: string; items: string }[];
  roles: {
    title: string;
    company: string;
    years: string;
    points: string[];
  }[];
  contact: {
    email: string;
    phone: string;
    location: string;
    education: string;
    now: string;
  };
};

export const home = homeData as HomeData;
