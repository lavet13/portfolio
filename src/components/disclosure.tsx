import {
  Context,
  composeEventHandlers,
  useControllableState,
} from "radix-ui/internal";
import { Slot } from "radix-ui/slot";
import { useId, type FC } from "react";

type DisclosureContextValue = {
  open: boolean;
  onOpenChange(open: boolean): void;
  contentId: string; // useId(): links Trigger's aria-controls to Content's id
};

const DISCLOSURE_NAME = "Disclosure";

const [DisclosureProvider, useDisclosureContext] =
  Context.createContext<DisclosureContextValue>(DISCLOSURE_NAME);

type DisclosureRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
} & React.ComponentProps<"div">;

const DisclosureRoot: FC<DisclosureRootProps> = (props) => {
  const { open: openProp, defaultOpen, onOpenChange, ...rootProps } = props;
  const contentId = useId();
  const [open, setOpen] = useControllableState({
    defaultProp: defaultOpen ?? false,
    prop: openProp,
    onChange: onOpenChange,
    caller: DISCLOSURE_NAME,
  });

  return (
    <DisclosureProvider
      open={open}
      onOpenChange={setOpen}
      contentId={contentId}
    >
      <div data-state={open ? "open" : "closed"} {...rootProps} />
    </DisclosureProvider>
  );
};
DisclosureRoot.displayName = DISCLOSURE_NAME;

const DISCLOSURE_TRIGGER_NAME = "DisclosureTrigger";
type DisclosureTriggerProps = {
  asChild?: boolean;
} & React.ComponentProps<"button">;

const DisclosureTrigger: FC<DisclosureTriggerProps> = (props) => {
  const { asChild = false, onClick, ...buttonProps } = props;
  const context = useDisclosureContext(DISCLOSURE_TRIGGER_NAME);
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-state={context.open ? "open" : "closed"}
      type={asChild ? undefined : "button"}
      aria-expanded={context.open}
      aria-controls={context.contentId}
      onClick={composeEventHandlers(onClick, () =>
        context.onOpenChange(!context.open),
      )}
      {...buttonProps}
    />
  );
};
DisclosureTrigger.displayName = DISCLOSURE_TRIGGER_NAME;

const DISCLOSURE_CONTENT_NAME = "DisclosureContent";
type DisclosureContentProps = React.ComponentProps<"div">;
const DisclosureContent: FC<DisclosureContentProps> = (props) => {
  const context = useDisclosureContext(DISCLOSURE_CONTENT_NAME);

  if (!context.open) return null;

  return (
    <div
      data-state={context.open ? "open" : "closed"}
      id={context.contentId}
      {...props}
    />
  );
};
DisclosureContent.displayName = DISCLOSURE_CONTENT_NAME;

const Root = DisclosureRoot;
const Trigger = DisclosureTrigger;
const Content = DisclosureContent;

export { Root, Trigger, Content };

export type {
  DisclosureRootProps,
  DisclosureTriggerProps,
  DisclosureContentProps,
};
