import Tippy from "@tippyjs/react/headless";
import { cloneElement, memo, useRef, useState, type FocusEvent, type MouseEvent, type ReactElement, type ReactNode } from "react";
import * as S from "../styles";

const TOOLTIP_SHOW_DELAY = 160;
const TOOLTIP_HIDE_DELAY = 90;
const TOOLTIP_ANIMATION_MS = 240;

type TooltipChildProps = {
  onMouseEnter?: (event: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
};

type AppTooltipProps = {
  content: ReactNode;
  children: ReactElement<TooltipChildProps>;
  placement?: "top" | "bottom" | "left" | "right";
};

const AppTooltip = memo(function AppTooltip({ content, children, placement = "bottom" }: AppTooltipProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };

  const showTooltip = () => {
    clearTimers();
    showTimer.current = setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() => setOpen(true));
    }, TOOLTIP_SHOW_DELAY);
  };

  const hideTooltip = () => {
    clearTimers();
    hideTimer.current = setTimeout(() => {
      setOpen(false);
      hideTimer.current = setTimeout(() => setMounted(false), TOOLTIP_ANIMATION_MS);
    }, TOOLTIP_HIDE_DELAY);
  };

  // eslint-disable-next-line react-hooks/refs
  const child = cloneElement(children, {
    onMouseEnter: (event: MouseEvent<HTMLElement>) => {
      children.props.onMouseEnter?.(event);
      showTooltip();
    },
    onMouseLeave: (event: MouseEvent<HTMLElement>) => {
      children.props.onMouseLeave?.(event);
      hideTooltip();
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      children.props.onFocus?.(event);
      showTooltip();
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      children.props.onBlur?.(event);
      hideTooltip();
    },
  });

  return (
    <Tippy
      visible={mounted}
      placement={placement}
      offset={[0, 8]}
      duration={0}
      render={(attrs) => (
        <div tabIndex={-1} {...attrs}>
          <S.TooltipBox
            initial={false}
            animate={open ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: TOOLTIP_ANIMATION_MS / 1000, ease: "easeOut" }}
          >
            {typeof content === "string" ? <S.TooltipText>{content}</S.TooltipText> : content}
          </S.TooltipBox>
        </div>
      )}
    >
      {child}
    </Tippy>
  );
});

export default AppTooltip;
