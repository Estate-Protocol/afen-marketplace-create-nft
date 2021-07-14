import Router from "next/router";

export const reloadPage = (id?: string) => {
  if (typeof window !== "undefined") {
    // const { pathname, push } = Router;
    // push({ pathname, query: { id } }, null, { shallow: true }).catch(() => {});
    Router.reload();
  }
};
