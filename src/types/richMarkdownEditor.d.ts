declare module "rich-markdown-editor" {
  import React from "react";

  interface MarkdownEditorProps {
    defaultValue: string;
    onChange?: (newValueGetter: () => string) => void;
    dark?: boolean;
    autoFocus?: boolean;
    readOnly?: boolean;
    toc?: boolean;
    className?: string;
    placeholder?: string;
  }

  export type Theme = {
    almostBlack: string;
    lightBlack: string;
    almostWhite: string;
    white: string;
    white10: string;
    black: string;
    black10: string;
    primary: string;
    greyLight: string;
    grey: string;
    greyMid: string;
    greyDark: string;

    fontFamily: string;
    fontWeight: number | string;
    link: string;
    placeholder: string;
    textSecondary: string;
    textLight: string;
    selected: string;

    background: string;
    text: string;

    toolbarBackground: string;
    toolbarInput: string;
    toolbarItem: string;

    blockToolbarBackground: string;
    blockToolbarTrigger: string;
    blockToolbarTriggerIcon: string;
    blockToolbarItem: string;

    quote: string;
    codeBackground?: string;
    codeBorder?: string;
    horizontalRule: string;

    hiddenToolbarButtons?: HiddenToolbarButtons;
  };

  export const dark: Theme;
  export const light: Theme;

  export default function MarkdownEditor(
    props: React.PropsWithChildren<MarkdownEditorProps>
  ): JSX.Element;
}
