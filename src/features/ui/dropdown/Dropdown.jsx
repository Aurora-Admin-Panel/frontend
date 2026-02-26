import { useCallback, useEffect, useRef, useState } from "react";

const ALIGN_CLASS = {
  start: "dropdown-start",
  end: "dropdown-end",
  left: "dropdown-left",
  right: "dropdown-right",
};

const Dropdown = ({
  trigger,
  children,
  align = "end",
  openOnHover = false,
  forceOpen = false,
  lazyMount = false,
  className = "",
  summaryClassName = "",
  contentClassName = "",
  contentAs = "ul",
  triggerAriaLabel,
  rootProps = {},
}) => {
  const detailsRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const { onToggle: rootOnToggle, ...restRootProps } = rootProps;
  const activeOpen = isOpen || forceOpen;

  useEffect(() => {
    if (!activeOpen) return undefined;

    const handlePointerDown = (event) => {
      const root = detailsRef.current;
      if (!root?.hasAttribute("open")) return;
      if (root.contains(event.target)) return;
      root.removeAttribute("open");
    };

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      const root = detailsRef.current;
      if (!root?.hasAttribute("open")) return;
      root.removeAttribute("open");
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    detailsRef.current?.removeAttribute("open");
  }, []);

  const handleToggle = (event) => {
    const nextOpen = Boolean(event.currentTarget?.open);
    setIsOpen(nextOpen);
    rootOnToggle?.(event);
  };

  const ContentTag = contentAs;
  const renderedChildren =
    typeof children === "function" ? children({ close, isOpen: activeOpen }) : children;
  const alignClass = ALIGN_CLASS[align] || ALIGN_CLASS.end;
  const hoverClass = openOnHover ? "dropdown-hover" : "";
  const forcedOpenClass = forceOpen ? "dropdown-open" : "";
  const shouldRenderContent = !lazyMount || activeOpen;

  return (
    <details
      ref={detailsRef}
      className={`dropdown ${alignClass} ${hoverClass} ${forcedOpenClass} ${className}`.trim()}
      onToggle={handleToggle}
      {...restRootProps}
    >
      <summary
        className={`list-none [&::-webkit-details-marker]:hidden ${summaryClassName}`.trim()}
        aria-label={triggerAriaLabel}
      >
        {trigger}
      </summary>
      {shouldRenderContent ? (
        <ContentTag className={`dropdown-content z-[1] ${contentClassName}`.trim()}>
          {renderedChildren}
        </ContentTag>
      ) : null}
    </details>
  );
};

export default Dropdown;
