import React, { useCallback } from "react";
import { NoteAttributes } from "../models/note";
import MarkdownEditor from "rich-markdown-editor";
import debounce from "lodash/debounce";
import "./NoteForm.css";

interface Props {
  onChange(changedAttributes: NoteAttributes): void;
  value: NoteAttributes;
}

export default function NoteForm({
  value,
  onChange
}: React.PropsWithChildren<Props>) {
  const debouncedOnTextChange = useCallback(
    debounce((getNewValue: () => string) => {
      onChange({
        ...value,
        text: getNewValue()
      });
    }, 250),
    [onChange]
  );

  return (
    <div className="NoteForm">
      <input
        autoFocus={!value.title}
        className="TitleInput"
        value={value.title}
        placeholder="Add a title to your note"
        onChange={e => onChange({ ...value, title: e.target.value })}
      />
      <div className="MarkDownEditor">
        <MarkdownEditor
          autoFocus={!!value.title}
          defaultValue={value.text}
          dark
          onChange={debouncedOnTextChange}
          toc
        />
      </div>
    </div>
  );
}
