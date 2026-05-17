export type PackIcon = {
  id: string;
  title: string;
  path: string;
};

export type PackIndex = {
  packId: string;
  count: number;
  items: PackIcon[];
};

export type IconPackMeta = {
  id: string;
  name: string;
  description: string;
  license: string;
  staticDir: string;
  indexPath: string;
};
