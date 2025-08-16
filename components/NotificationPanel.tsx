import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  Popover,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Notifications,
  NotificationsNone,
  MarkEmailRead,
  Delete,
  Close,
  Description,
  Assignment,
  Work,
  Assessment,
  Schedule
} from '@mui/icons-material';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationPanelProps {
  userId: number;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ userId }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification, refreshNotifications } = useNotifications(userId);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    refreshNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  const getDocumentIcon = (documentType?: string) => {
    switch (documentType) {
      case 'coop07': return <Description sx={{ color: '#303f9f' }} />;
      case 'coop10': return <Assessment sx={{ color: '#4caf50' }} />;
      case 'coop11': return <Work sx={{ color: '#303f9f' }} />;
      case 'coop12': return <Assignment sx={{ color: '#455a64' }} />;
      default: return <Schedule sx={{ color: '#1976d2' }} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'normal': return 'info';
      case 'low': return 'default';
      default: return 'info';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'เมื่อสักครู่';
    if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} วันที่แล้ว`;
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ mr: 1 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          {unreadCount > 0 ? <Notifications /> : <NotificationsNone />}
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 400, maxHeight: 600 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" color="primary.main">
              การแจ้งเตือน
            </Typography>
            <Box>
              {unreadCount > 0 && (
                <Button
                  size="small"
                  startIcon={<MarkEmailRead />}
                  onClick={markAllAsRead}
                  sx={{ mr: 1 }}
                >
                  อ่านทั้งหมด
                </Button>
              )}
              <IconButton size="small" onClick={handleClose}>
                <Close />
              </IconButton>
            </Box>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress size={24} />
            </Box>
          ) : notifications.length === 0 ? (
            <Alert severity="info" sx={{ textAlign: 'center' }}>
              ไม่มีการแจ้งเตือน
            </Alert>
          ) : (
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                      borderRadius: 1,
                      mb: 1,
                      border: notification.isRead ? 'none' : '1px solid',
                      borderColor: 'primary.light',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.selected'
                      }
                    }}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                  >
                    <Box display="flex" alignItems="center" mr={2}>
                      {getDocumentIcon(notification.documentType)}
                    </Box>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              fontWeight: notification.isRead ? 'normal' : 'bold',
                              flexGrow: 1
                            }}
                          >
                            {notification.title}
                          </Typography>
                          <Chip
                            label={notification.priority}
                            size="small"
                            color={getPriorityColor(notification.priority) as any}
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              mb: 0.5
                            }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            จาก: {notification.sender.fname} {notification.sender.sname} • {formatTimeAgo(notification.createdAt)}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < notifications.length - 1 && <Divider variant="inset" />}
                </React.Fragment>
              ))}
            </List>
          )}

          {notifications.length > 0 && (
            <Box textAlign="center" mt={2}>
              <Button
                size="small"
                onClick={refreshNotifications}
                disabled={loading}
              >
                รีเฟรช
              </Button>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationPanel;