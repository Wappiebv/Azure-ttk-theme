import { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Wrench,
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

  const getStatusIcon = (status: InstallationStatus) => {
    switch (status) {
      case 'Scheduled':
        return <CalendarIcon className="h-4 w-4" />;
      case 'In Progress':
        return <Wrench className="h-4 w-4" />;
      case 'Completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'Cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
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
          <p className="text-muted-foreground">
            Schedule and manage installation appointments
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Installation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.scheduled}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.upcoming}</div>
            <p className="text-xs text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
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
        </CardContent>
      </Card>

      {/* Installations List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredInstallations.length} Installation
            {filteredInstallations.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInstallations.map((installation) => (
              <div
                key={installation.id}
                className="rounded-lg border border-border p-4 hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{installation.type}</h3>
                      <Badge variant={getStatusVariant(installation.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(installation.status)}
                          {installation.status}
                        </span>
                      </Badge>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{installation.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                          {formatDate(installation.scheduledDate)} at {installation.scheduledTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Wrench className="h-4 w-4" />
                        <span>{installation.technicianName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{installation.duration} hours</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-muted-foreground mt-2">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <span>{installation.address}</span>
                    </div>

                    {installation.notes && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        {installation.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {installation.status === 'Scheduled' && (
                      <Button variant="default" size="sm">
                        Start Job
                      </Button>
                    )}
                  </div>
                </div>

                {/* Checklist Progress */}
                {installation.checklist.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Checklist</p>
                      <span className="text-xs text-muted-foreground">
                        {installation.checklist.filter((item) => item.completed).length} /{' '}
                        {installation.checklist.length} completed
                      </span>
                    </div>
                    <div className="space-y-1">
                      {installation.checklist.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div
                            className={`h-4 w-4 rounded flex items-center justify-center ${
                              item.completed
                                ? 'bg-green-500 text-white'
                                : 'border border-border'
                            }`}
                          >
                            {item.completed && <CheckCircle2 className="h-3 w-3" />}
                          </div>
                          <span
                            className={item.completed ? 'text-muted-foreground line-through' : ''}
                          >
                            {item.item}
                          </span>
                        </div>
                      ))}
                      {installation.checklist.length > 3 && (
                        <p className="text-xs text-muted-foreground pl-6">
                          +{installation.checklist.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredInstallations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No installations found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
