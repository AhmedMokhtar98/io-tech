// DummySlidesData.ts

export type Slide = {
  title: string;
  description: string;
  buttonText: string;
  image: string;
  background: string;
};

export const getDummySlides = (t: (key: string) => string): Slide[] => [
  {
    title: t("slide1.title"),
    description: t("slide1.description"),
    buttonText: t("slide1.buttonText"),
    image: "/me.jpg",
    background: "/cover.png",
  },
  {
    title: t("slide2.title"),
    description: t("slide2.description"),
    buttonText: t("slide2.buttonText"),
    image: "/me.jpg",
    background: "https://picsum.photos/1920/1080?random=4",
  },
];
