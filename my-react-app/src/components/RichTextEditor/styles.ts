import styled from 'styled-components';

export const EditorWrapper = styled.div<{ height: string | number }>`
  margin-bottom: 24px;
  
  .quill {
    height: ${props => typeof props.height === 'number' ? `${props.height}px` : props.height};
    display: flex;
    flex-direction: column;
  }

  .ql-toolbar.ql-snow {
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    border-bottom: 1px solid #d9d9d9;
  }

  .ql-container {
    font-size: 14px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .ql-container.ql-snow {
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
    border: 1px solid #d9d9d9;
    border-top: none;
  }

  .ql-editor {
    flex: 1;
    overflow-y: auto;
    min-height: ${props => typeof props.height === 'number' ? `${props.height - 42}px` : props.height};
  }

  .ql-snow .ql-picker.ql-color-picker .ql-picker-label,
  .ql-snow .ql-picker.ql-background .ql-picker-label {
    padding: 0 4px;
  }

  .ql-snow .ql-picker.ql-color-picker .ql-picker-label svg,
  .ql-snow .ql-picker.ql-background .ql-picker-label svg {
    width: 18px;
    height: 18px;
  }
`;
