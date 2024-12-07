import { Button, Space, SpaceProps } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';

export interface ActionButtonsProps extends SpaceProps {
  onAdd?: () => void;
  onRefresh?: () => void;
  showAdd?: boolean;
  showRefresh?: boolean;
}

const ActionButtons = ({
  onAdd,
  onRefresh,
  showAdd = true,
  showRefresh = true,
  ...spaceProps
}: ActionButtonsProps) => {
  return (
    <Space {...spaceProps}>
      {showAdd && (
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          新增
        </Button>
      )}
      {showRefresh && (
        <Button icon={<ReloadOutlined />} onClick={onRefresh}>
          刷新
        </Button>
      )}
    </Space>
  );
};

export default ActionButtons;
