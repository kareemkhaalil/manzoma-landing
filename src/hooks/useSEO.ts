import { useEffect } from "react";

export interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
}

export function useSEO({ title, description, keywords, canonical, image }: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Update Description Meta Tag
    if (description) {
      let metaDesc = document.querySelector("meta[name='description']");
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", description);
      
      // Update Open Graph Description
      let ogDesc = document.querySelector("meta[property='og:description']");
      if (ogDesc) {
        ogDesc.setAttribute("content", description);
      }
    }

    // 3. Update Keywords Meta Tag
    if (keywords) {
      let metaKey = document.querySelector("meta[name='keywords']");
      if (!metaKey) {
        metaKey = document.createElement("meta");
        metaKey.setAttribute("name", "keywords");
        document.head.appendChild(metaKey);
      }
      metaKey.setAttribute("content", keywords);
    }

    // 4. Update Canonical Link
    let linkCan = document.querySelector("link[rel='canonical']");
    if (!linkCan) {
      linkCan = document.createElement("link");
      linkCan.setAttribute("rel", "canonical");
      document.head.appendChild(linkCan);
    }
    const currentUrl = new URL(window.location.href);
    const targetCanonical = canonical || `${currentUrl.origin}${currentUrl.pathname}`;
    linkCan.setAttribute("href", targetCanonical);
    
    // Update Open Graph URL
    let ogUrl = document.querySelector("meta[property='og:url']");
    if (ogUrl) {
      ogUrl.setAttribute("content", targetCanonical);
    }
    
    // Update Open Graph Title
    let ogTitle = document.querySelector("meta[property='og:title']");
    if (ogTitle) {
      ogTitle.setAttribute("content", title);
    }

    if (image) {
      let ogImage = document.querySelector("meta[property='og:image']");
      if (!ogImage) {
        ogImage = document.createElement("meta");
        ogImage.setAttribute("property", "og:image");
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute("content", image);
      let twitterImage = document.querySelector("meta[name='twitter:image']");
      if (!twitterImage) {
        twitterImage = document.createElement("meta");
        twitterImage.setAttribute("name", "twitter:image");
        document.head.appendChild(twitterImage);
      }
      twitterImage.setAttribute("content", image);
    }
  }, [title, description, keywords, canonical, image]);
}
