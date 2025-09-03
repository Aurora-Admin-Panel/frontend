export async function copyToClipboard(text) {
    // Primary: modern Clipboard API (requires HTTPS or localhost)
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return { ok: true };
      } catch (err) {
        // continue to fallback
      }
    }
  
    // Fallback: hidden textarea + execCommand('copy')
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      // Avoid scrolling to bottom
      textarea.style.position = "fixed";
      textarea.style.top = "-1000px";
      textarea.style.left = "-1000px";
      textarea.setAttribute("readonly", "");
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const succeeded = document.execCommand("copy");
      document.body.removeChild(textarea);
      return { ok: succeeded };
    } catch (fallbackErr) {
      return { ok: false, error: fallbackErr };
    }
  }