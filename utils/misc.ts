import slugify from "slugify";

export const copyToClipboard = async (
  data: string,
  setCopied?: (value: boolean) => void
) => {
  try {
    await navigator.clipboard.writeText(data);
    if (setCopied) {
      setCopied(true);
      setTimeout(function () {
        setCopied(false);
      }, 2000);
    }
  } catch (err) {
    // do nothing
  }
};

export const slugifyText = (text: string) => {
  return slugify(text, {
    replacement: "-",
    lower: true,
  });
};

export const parseUrl = (url: string) => {
  return url.replace(/^(?:https?:\/\/)?(?:www\.)?(mailto:)?(tel:)?/i, "");
};

export const getDevice = () => {
  if (typeof window !== "undefined") {
    // const { platform } = navigator;
    if (/iPad|iPhone|iPod/.test(navigator?.platform)) {
      return "ios";
    }
    if (/Android/.test(navigator?.platform)) {
      return "android";
    }
  }
};

// FIXME: Check screen dimensions as well
export const isMobile = () => {
  const device = getDevice();
  return device === "ios" || device === "android";
};

export const handleClickOutside = (
  e: MouseEvent,
  node: React.MutableRefObject<undefined>,
  action: () => void
) => {
  // @ts-ignore
  if (node.current.contains(e.target)) {
    return;
  }

  // on outside click
  action();
};
