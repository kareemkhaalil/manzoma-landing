import { useEffect } from "react";

export function useSchema(schemas: object | object[]) {
  useEffect(() => {
    const scriptTags: HTMLScriptElement[] = [];
    const schemaArray = Array.isArray(schemas) ? schemas : [schemas];

    schemaArray.forEach((schema, index) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
      scriptTags.push(script);
    });

    // Cleanup when component unmounts to prevent duplicate/residual tags
    return () => {
      scriptTags.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, [schemas]);
}
