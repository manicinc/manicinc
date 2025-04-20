
"use client"
import React, { useEffect } from "react";

interface DisqusComponentProps {
  shortname: string;
  identifier: string;
  title: string;
  url: string;
}

export const DisqusComponent: React.FC<DisqusComponentProps> = ({
  shortname,
  identifier,
  title,
  url,
}) => {
  useEffect(() => {
    if ((window as any).DISQUS === undefined) {
      const script = document.createElement("script");
      script.src = `https://${shortname}.disqus.com/embed.js`;
      script.setAttribute("data-timestamp", Date.now().toString());
      script.async = true;
      document.body.appendChild(script);
    } else {
      (window as any).DISQUS.reset({
        reload: true,
        config: function () {
          this.page.identifier = identifier;
          this.page.title = title;
          this.page.url = url;
        },
      });
    }
  }, [shortname, identifier, title, url]);

  return (
    <div className="mt-8 w-full max-w-4xl mx-auto">
      <div id="disqus_thread" className="rounded-xl shadow-lg p-4 bg-white dark:bg-gray-800" />
    </div>
  );
};

export default DisqusComponent;
