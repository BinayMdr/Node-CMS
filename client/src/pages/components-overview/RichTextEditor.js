import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const RichTextEditor = ({ name, value, onChange }) => {
  const editorRef = useRef(null);

  return (
    <Editor
      apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
      onInit={(evt, editor) => (editorRef.current = editor)}
      initialValue={value || ''} // use initialValue instead of value for code plugin
      onEditorChange={(content) => onChange(name, content)}
      init={{
        height: 400,
        menubar: true, // must be true for code plugin to work
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code',
          'insertdatetime table paste help wordcount',
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | ' +
          'alignleft aligncenter alignright alignjustify | ' +
          'bullist numlist outdent indent | removeformat | code | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
      }}
    />
  );
};

export default RichTextEditor;
