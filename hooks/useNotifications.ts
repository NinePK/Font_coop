import { useState, useEffect } from 'react';

interface Notification {
  id: number;
  recipientId: number;
  senderId: number;
  type: string;
  title: string;
  message: string;
  documentType?: string;
  relatedId?: number;
  isRead: boolean;
  priority: string;
  createdAt: string;
  sender: {
    id: number;
    fname: string;
    sname: string;
    username: string;
  };
}

export const useNotifications = (userId: number) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // ดึงการแจ้งเตือนทั้งหมด
  const fetchNotifications = async () => {
    try {
      const backUrl = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:6008';
      const response = await fetch(`${backUrl}/notification/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // ดึงจำนวนการแจ้งเตือนที่ยังไม่อ่าน
  const fetchUnreadCount = async () => {
    try {
      const backUrl = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:6008';
      const response = await fetch(`${backUrl}/notification/user/${userId}/unread/count`);
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // ทำเครื่องหมายว่าอ่านแล้ว
  const markAsRead = async (notificationId: number) => {
    try {
      const backUrl = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:6008';
      const response = await fetch(`${backUrl}/notification/${notificationId}/read`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        // อัปเดต state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // ทำเครื่องหมายว่าอ่านแล้วทั้งหมด
  const markAllAsRead = async () => {
    try {
      const backUrl = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:6008';
      const response = await fetch(`${backUrl}/notification/user/${userId}/read-all`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        // อัปเดต state
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // ลบการแจ้งเตือน
  const deleteNotification = async (notificationId: number) => {
    try {
      const backUrl = process.env.NEXT_PUBLIC_BACK_URL || 'http://localhost:6008';
      const response = await fetch(`${backUrl}/notification/${notificationId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // อัปเดต state
        const deletedNotification = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        
        // ถ้าการแจ้งเตือนที่ลบยังไม่ได้อ่าน ให้ลดจำนวน unread
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // ฟังก์ชันรีเฟรช
  const refreshNotifications = () => {
    fetchNotifications();
    fetchUnreadCount();
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [userId]);

  // อัปเดตข้อมูลทุก 30 วินาที
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [userId]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications
  };
};