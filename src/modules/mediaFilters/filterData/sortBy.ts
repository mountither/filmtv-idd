export type SortByData = {
  id: string;
  label: string;
};

export type SortByConfig = {
  defaultId: string;
  data: SortByData[];
};

export const filmSortByOptions: SortByConfig = {
  defaultId: "popularity.desc",
  data: [
    {
      id: "popularity.desc",
      label: "Popularity (high)",
    },
    {
      id: "popularity.asc",
      label: "Popularity (low)",
    },
    {
      id: "original_title.asc",
      label: "Title (A-Z)",
    },
    {
      id: "original_title.desc",
      label: "Title (Z-A)",
    },
    {
      id: "release_date.desc",
      label: "Release Date (recent)",
    },
    {
      id: "release_date.asc",
      label: "Release Date (oldest)",
    },
  ],
};

export const tvSortByOptions: SortByConfig = {
  defaultId: "popularity.desc",
  data: [
    {
      id: "popularity.desc",
      label: "Popularity (high)",
    },
    {
      id: "popularity.asc",
      label: "Popularity (low)",
    },
    {
      id: "first_air_date.desc",
      label: "Air Date (recent)",
    },
    {
      id: "first_air_date.asc",
      label: "Air Date (oldest)",
    },
  ],
};
