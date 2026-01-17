import { useState } from 'react';
import { Search, Bell, Moon, Sun, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useAppStore } from '../../stores';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function Topbar() {
  const { theme, toggleTheme } = useAppStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'New quote accepted',
      message: 'James Anderson accepted quote Q-2026-001',
      time: '5m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Installation scheduled',
      message: 'Home theatre installation scheduled for Jan 20',
      time: '1h ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Low stock alert',
      message: 'KEF LS50 Meta stock is running low',
      time: '2h ago',
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-6">
      {/* Search */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers, products, quotes..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </Button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-12 z-50 w-80 rounded-lg border border-border bg-card shadow-lg">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <h3 className="font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`border-b border-border px-4 py-3 hover:bg-accent transition-colors cursor-pointer ${
                        notification.unread ? 'bg-muted/50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border px-4 py-2 text-center">
                  <button className="text-sm text-primary hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="rounded-full"
            title="User menu"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </div>
          </Button>

          {/* User Dropdown */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-12 z-50 w-56 rounded-lg border border-border bg-card shadow-lg">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-sm font-medium">John Smith</p>
                  <p className="text-xs text-muted-foreground">john.smith@company.com</p>
                </div>
                <div className="py-2">
                  <button className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <button className="flex w-full items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors">
                    <SettingsIcon className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                </div>
                <div className="border-t border-border py-2">
                  <button className="flex w-full items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors">
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
