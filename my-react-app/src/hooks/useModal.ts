import { useState } from 'react';
import { Form } from 'antd';
import type { FormInstance } from 'antd/es/form';

interface UseModalProps<T> {
  onSubmit?: (values: T) => Promise<void>;
  afterClose?: () => void;
  form?: FormInstance;
}

export function useModal<T = any>({ 
  onSubmit, 
  afterClose,
  form: externalForm,
}: UseModalProps<T> = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<T>();
  const modalForm = externalForm || form;

  const showModal = () => setIsVisible(true);
  const hideModal = () => setIsVisible(false);

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await modalForm.validateFields();
      await onSubmit?.(values);
      hideModal();
      modalForm.resetFields();
    } catch (error) {
      console.error('Modal submit failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    hideModal();
    modalForm.resetFields();
    afterClose?.();
  };

  return {
    isVisible,
    loading,
    showModal,
    hideModal,
    handleOk,
    handleCancel,
    form: modalForm,
  };
}
