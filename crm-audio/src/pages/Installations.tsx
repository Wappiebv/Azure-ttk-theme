import { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  Circle,
  Wrench,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useInstallationStore } from '../stores';
import { formatDate } from '../lib/utils';
import type { InstallationStatus } from '../types';

export default function Installations() {
  const installations = useInstallationStore((state) => state.installations);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [statusFilter, setStatusFilter] = useState<InstallationStatus | 'All'>('All');

  // Filter installations
  const filteredInstallations = useMemo(() => {
    let filtered = installations;

    if (statusFilter !== 'All') {
      filtered = filtered.filter((installation) => installation.status === statusFilter);
    }

    return filtered.sort(
      (a, b) =>
        new Date(a.scheduledDate + ' ' + a.scheduledTime).getTime() -
        new Date(b.scheduledDate + ' ' + b.scheduledTime).getTime()
    );
  }, [installations, statusFilter]);

  const getStatusVariant = (
    status: InstallationStatus
  ): 'default' | 'secondary' | 'success' | 'warning' | 'outline' | 'destructive' => {
    switch (status) {
      case 'Scheduled':
        return 'default';
      case 'In Progress':
        return 'warning';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    const scheduled = installations.filter((i) => i.status === 'Scheduled').length;
    const inProgress = installations.filter((i) => i.status === 'In Progress').length;
    const completed = installations.filter((i) => i.status === 'Completed').length;
    const upcoming = installations.filter(
      (i) =>
        i.status === 'Scheduled' &&
        new Date(i.scheduledDate) >= new Date()
    ).length;

    return { scheduled, inProgress, completed, upcoming };
  }, [installations]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Installations</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage installation appointments
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Installation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold mt-2">{stats.scheduled}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold mt-2 text-amber-600">{stats.inProgress}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold mt-2 text-green-600">{stats.completed}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold mt-2">{stats.upcoming}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={statusFilter === 'All' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('All')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'Scheduled' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('Scheduled')}
          >
            Scheduled
          </Button>
          <Button
            variant={statusFilter === 'In Progress' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('In Progress')}
          >
            In Progress
          </Button>
          <Button
            variant={statusFilter === 'Completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('Completed')}
          >
            Completed
          </Button>
          <Button
            variant={statusFilter === 'Cancelled' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('Cancelled')}
          >
            Cancelled
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
          >
            Calendar
          </Button>
        </div>
      </div>

      {/* Installations List */}
      <div className="space-y-4">
        {filteredInstallations.map((installation) => {
          const completedItems = installation.checklist.filter((item) => item.completed).length;
          const totalItems = installation.checklist.length;
          const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

          return (
            <Card key={installation.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">{installation.type}</h3>
                      <Badge variant={getStatusVariant(installation.status)}>
                        {installation.status}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Customer</p>
                          <p className="font-medium">{installation.customerName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Scheduled</p>
                          <p className="font-medium">
                            {formatDate(installation.scheduledDate)} at {installation.scheduledTime}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                          <Wrench className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Technician</p>
                          <p className="font-medium">{installation.technicianName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="font-medium">{installation.duration} hours</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 mt-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{installation.address}</span>
                    </div>

                    {installation.notes && (
                      <div className="mt-3 p-3 bg-muted rounded-md">
                        <p className="text-sm text-muted-foreground italic">
                          {installation.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <Button variant="ghost" size="sm" className="flex-shrink-0">
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {/* Checklist Progress */}
                {installation.checklist.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold">Installation Checklist</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {completedItems} of {totalItems} completed
                        </span>
                        <span className="text-xs font-semibold text-primary">
                          {Math.round(progress)}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Checklist Items */}
                    <div className="space-y-2">
                      {installation.checklist.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                        >
                          {item.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          )}
                          <span
                            className={`text-sm ${
                              item.completed
                                ? 'text-muted-foreground line-through'
                                : 'text-foreground'
                            }`}
                          >
                            {item.item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {filteredInstallations.length === 0 && (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No installations found</h3>
                <p className="text-muted-foreground mb-4">
                  {statusFilter === 'All'
                    ? 'Get started by creating your first installation'
                    : `No ${statusFilter.toLowerCase()} installations`}
                </p>
                {statusFilter === 'All' && (
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Installation
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
