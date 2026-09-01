import { getContent } from "./content";

type JsonLdObject = Record<string, unknown>;

export function generateJsonLd(): JsonLdObject[] {
  const c = getContent();
  const seo = (c as Record<string, unknown>).seo as {
    jobTitle?: string;
    description?: string;
    specialties?: string[];
    credentials?: string[];
    location?: string;
    siteUrl?: string;
    socialLinks?: string[];
    alumniOf?: string[];
    openingHours?: string;
  } | undefined;
  if (!seo) return [];

  const siteUrl = seo.siteUrl || "";
  const schemas: JsonLdObject[] = [];

  const person: JsonLdObject = {
    "@type": "Person",
    name: c.site.name,
    jobTitle: seo.jobTitle,
    description: seo.description,
    ...(siteUrl && { url: siteUrl }),
    ...(c.site.email && { email: `mailto:${c.site.email}` }),
    ...(seo.location && {
      address: {
        "@type": "PostalAddress",
        addressLocality: seo.location,
        addressCountry: "TR",
      },
    }),
    ...(seo.specialties && seo.specialties.length > 0 && { knowsAbout: seo.specialties }),
    ...(seo.credentials && seo.credentials.length > 0 && {
      hasCredential: seo.credentials.map((cr) => ({
        "@type": "EducationalOccupationalCredential",
        credentialCategory: cr,
      })),
    }),
    ...(seo.alumniOf && seo.alumniOf.length > 0 && {
      alumniOf: seo.alumniOf.map((o) => ({
        "@type": "EducationalOrganization",
        name: o,
      })),
    }),
    ...(seo.socialLinks && seo.socialLinks.length > 0 && {
      sameAs: seo.socialLinks,
    }),
  };

  const service: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${c.site.name} - ${seo.jobTitle || "Psikolog"}`,
    description: seo.description,
    ...(siteUrl && { url: siteUrl }),
    ...(c.site.email && { email: c.site.email }),
    ...(c.site.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: c.site.address,
        ...(seo.location && { addressLocality: seo.location }),
        addressCountry: "TR",
      },
    }),
    ...(seo.openingHours && { openingHours: seo.openingHours }),
    provider: person,
    ...(c.services && c.services.length > 0 && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Terapi Hizmetleri",
        itemListElement: c.services.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: s.title,
            description: s.desc,
          },
        })),
      },
    }),
  };
  schemas.push(service);

  if (c.faq && c.faq.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: c.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    });
  }

  if (siteUrl) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: `${c.site.name} - ${seo.jobTitle || "Psikolog"}`,
      url: siteUrl,
    });
  }

  return schemas;
}
