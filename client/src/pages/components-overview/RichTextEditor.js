import React, { useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const RichTextEditor = ({ name, value, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getContent()) {
      editorRef.current.setContent(value || '');
    }
  }, [value]);

  return (
    <Editor
      apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
      onInit={(evt, editor) => (editorRef.current = editor)}
      value={value || ''}
      onEditorChange={(content) => onChange(name, content)}
      init={{
        height: 300,
        resize: false,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks',
          'insertdatetime table paste code help wordcount',
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | ' +
          'alignleft aligncenter alignright alignjustify | ' +
          'bullist numlist outdent indent | removeformat | help',
        directionality: 'ltr',
      }}
    />
  );
};

export default RichTextEditor;
