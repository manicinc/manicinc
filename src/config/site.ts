interface MetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title = "Manic Agency",
  description = "Manic Agency is a software and design firm housing a multitude of innovative tech and media platforms.",
  image = "/agency.PNG",
  noIndex = false,
}: MetadataOptions) {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "",
    },
    metadataBase: new URL("https://manic.agency"),
    themeColor: "#FFF",
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
