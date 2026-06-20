import { useEffect } from 'react';

export function MetaTags() {
  useEffect(() => {
    // Set document title
    document.title = 'Kurt Michael Mirafelix | CS Student & Developer';

    // Set or update meta tags
    const metaTags = [
      { name: 'description', content: 'Student Developer specializing in React & TypeScript. Building elegant, performant web applications with exceptional user experiences.' },
      { name: 'keywords', content: 'Frontend Engineer, React Developer, TypeScript, Web Developer, Portfolio, Kurt Mirafelix' },
      { name: 'author', content: 'Kurt Michael Mirafelix' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },

      // Open Graph / Facebook
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Kurt Michael Mirafelix | CS Student & Developer' },
      { property: 'og:description', content: 'Student Developer specializing in React & TypeScript. President\'s Lister at Cavite State University with a 1.31 GWA.' },
      { property: 'og:url', content: 'https://kurt-mirafelix.kmirafelix.workers.dev/' },

      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Kurt Michael Mirafelix | CS Student & Developer' },
      { name: 'twitter:description', content: 'Student Developer specializing in React & TypeScript. Building elegant, performant web applications.' },
    ];

    metaTags.forEach(({ name, property, content }) => {
      const attribute = name ? 'name' : 'property';
      const value = name || property;
      let meta = document.querySelector(`meta[${attribute}="${value}"]`);

      if (!meta) {
        meta = document.createElement('meta');
        if (name) {
          meta.setAttribute('name', name);
        } else if (property) {
          meta.setAttribute('property', property);
        }
        document.head.appendChild(meta);
      }

      meta.setAttribute('content', content);
    });
  }, []);

  return null;
}
