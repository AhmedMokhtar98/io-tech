// DummyTestimonialsData.ts

export type Testimonial = {
  nameKey: string;
  titleKey: string;
  quoteKey: string;
  image: string;
};

/**
 * Dummy Testimonials — uses translation keys for name, title, and quote.
 */
export const testimonials: Testimonial[] = [
  {
    nameKey: "testimonials.testimonial1.name",
    titleKey: "testimonials.testimonial1.title",
    quoteKey: "testimonials.testimonial1.quote",
    image: "/me.jpg",
  },
  {
    nameKey: "testimonials.testimonial2.name",
    titleKey: "testimonials.testimonial2.title",
    quoteKey: "testimonials.testimonial2.quote",
    image: "/me.jpg",
  },
];
