import React from 'react';
import { Button, Space, Divider, Dropdown } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

interface ActionButtonGroupProps {
  onAdd?: () => void;
  onImport?: () => void;
  onExport?: () => void;
  onBatchDelete?: () => void;
  onBatchApprove?: () => void;
  onBatchDisable?: () => void;
  onBatchEnable?: () => void;
  onResetPassword?: () => void;
  selectedRows?: any[];
  loading?: boolean;
}

const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
  onAdd,
  onImport,
  onExport,
  onBatchDelete,
  onBatchApprove,
  onBatchDisable,
  onBatchEnable,
  onResetPassword,
  selectedRows = [],
  loading
}) => {
  const hasSelected = selectedRows.length > 0;

  // 主要按钮组
  const primaryButtons = [
    { key: 'add', label: '新增用户', type: 'primary', onClick: onAdd },
    { key: 'import', label: '批量导入', type: 'primary', onClick: onImport }
  ];

  // 次要按钮组
  const secondaryButtons = [
    { key: 'export', label: '导出', onClick: onExport },
    { 
      key: 'delete', 
      label: '批量删除', 
      danger: true, 
      disabled: !hasSelected,
      onClick: onBatchDelete
    }
  ];

  // 更多操作菜单
  const moreMenuItems: MenuProps['items'] = [
    {
      key: 'approve',
      label: '批量审批',
      disabled: !hasSelected,
      onClick: onBatchApprove
    },
    {
      key: 'disable',
      label: '批量禁用',
      disabled: !hasSelected,
      onClick: onBatchDisable
    },
    {
      key: 'enable',
      label: '批量启用',
      disabled: !hasSelected,
      onClick: onBatchEnable
    },
    {
      key: 'reset',
      label: '重置密码',
      disabled: !hasSelected,
      onClick: onResetPassword
    }
  ];

  return (
    <div className="action-button-group">
      <Space wrap>
        {/* 主要按钮组 */}
        <Space>
          {primaryButtons.map(btn => (
            <Button
              key={btn.key}
              type={btn.type as any}
              onClick={btn.onClick}
              loading={loading}
            >
              {btn.label}
            </Button>
          ))}
        </Space>

        {/* 次要按钮组 */}
        <Space>
          {secondaryButtons.map(btn => (
            <Button
              key={btn.key}
              danger={btn.danger}
              disabled={btn.disabled}
              onClick={btn.onClick}
              loading={loading}
            >
              {btn.label}
            </Button>
          ))}
        </Space>

        <Divider type="vertical" />

        {/* 更多操作下拉菜单 */}
        <Dropdown menu={{ items: moreMenuItems }} placement="bottomRight">
          <Button>
            <Space>
              更多操作
              <MoreOutlined />
            </Space>
          </Button>
        </Dropdown>

        {/* 选中提示 */}
        {hasSelected && (
          <span style={{ marginLeft: 8 }}>
            已选择 {selectedRows.length} 项
          </span>
        )}
      </Space>

      <style>
        {`
          .action-button-group {
            margin-bottom: 16px;
          }
          
          .action-button-group .ant-space {
            flex-wrap: wrap;
          }
        `}
      </style>
    </div>
  );
};

export default ActionButtonGroup;
