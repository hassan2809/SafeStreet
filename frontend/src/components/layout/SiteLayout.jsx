import React from "react";

const SiteLayout = ({ children, withTopPadding = false }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className={withTopPadding ? "pt-16" : ""}>{children}</main>
    </div>
  );
};

export default SiteLayout;


