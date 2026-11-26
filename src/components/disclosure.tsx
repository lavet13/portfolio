import {
  Context,
  composeEventHandlers,
  useControllableState,
  DismissableLayer,
} from "radix-ui/internal";
import { Slot } from "radix-ui/slot";
import { useId, useState, type ComponentProps, type FC } from "react";

type DisclosureContextValue = {
  open: boolean;
  onOpenChange(open: boolean): void;
  contentId: string; // useId(): links Trigger's aria-controls to Content's id
  trigger: HTMLButtonElement | null;
  onTriggerChange(trigger: HTMLButtonElement | null): void;
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
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);
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
      trigger={trigger}
      onTriggerChange={setTrigger}
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
  const { open, contentId, onOpenChange, onTriggerChange } =
    useDisclosureContext(DISCLOSURE_TRIGGER_NAME);
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={onTriggerChange}
      data-state={open ? "open" : "closed"}
      type={asChild ? undefined : "button"}
      aria-expanded={open}
      aria-controls={contentId}
      onClick={composeEventHandlers(onClick, () => onOpenChange(!open))}
      {...buttonProps}
    />
  );
};
DisclosureTrigger.displayName = DISCLOSURE_TRIGGER_NAME;

const DISCLOSURE_CONTENT_NAME = "DisclosureContent";
type DisclosureContentProps = Omit<
  ComponentProps<typeof DismissableLayer.Root>,
  "onDismiss"
>;
const DisclosureContent: FC<DisclosureContentProps> = (props) => {
  const { open, contentId, trigger, onOpenChange } = useDisclosureContext(
    DISCLOSURE_CONTENT_NAME,
  );
  const { onInteractOutside, ...contentProps } = props;

  if (!open) return null;

  return (
    <DismissableLayer.Root
      data-state={open ? "open" : "closed"}
      id={contentId}
      onInteractOutside={composeEventHandlers(onInteractOutside, (event) => {
        // the trigger toggles on its own click; don't also dismiss on its pointerdown
        if (event.target instanceof Node && trigger?.contains(event.target))
          event.preventDefault();
      })}
      onDismiss={() => onOpenChange(false)}
      {...contentProps}
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
