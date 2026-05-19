import { useState } from "react";

const WorkspaceUrl = ({ branding }) => {
  const [copied, setCopied] = useState(false);
  const workspaceDomain = branding?.domain || branding?.subdomain || "workspace";
  const workspaceUrl = `https://${workspaceDomain}.chemcore.app`;

  const handleCopy = () => {
    navigator.clipboard.writeText(workspaceUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="workspace-url">
      <i className="bi bi-globe2"></i>
      <span>Your workspace URL:</span>
      <a href={workspaceUrl}>{workspaceUrl}</a>
      <button
        type="button"
        className="workspace-copy"
        title="Copy URL"
        onClick={handleCopy}
      >
        <i className={`bi ${copied ? "bi-check-lg" : "bi-copy"}`}></i>
      </button>
    </div>
  );
};

export default WorkspaceUrl;
