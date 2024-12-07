import { Form, FormProps } from 'antd';
import { ReactNode } from 'react';

export interface BaseFormProps extends FormProps {
  children: ReactNode;
}

const BaseForm = ({ children, ...props }: BaseFormProps) => {
  return (
    <Form layout="vertical" {...props}>
      {children}
    </Form>
  );
};

export default BaseForm;
