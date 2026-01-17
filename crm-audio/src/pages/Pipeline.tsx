import { useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { Plus, User, Calendar, DollarSign, Flag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useDealStore } from '../stores';
import { formatCurrency, formatDate } from '../lib/utils';
import type { Deal, DealStage } from '../types';

const stages: DealStage[] = [
  'Lead',
  'Qualified',
  'Proposal Sent',
  'Negotiation',
  'Won',
  'Lost',
];

interface DealCardProps {
  deal: Deal;
  isDragging?: boolean;
}

function DealCard({ deal, isDragging = false }: DealCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div
      className={`rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm line-clamp-2">{deal.title}</h3>
        <Badge variant={getPriorityColor(deal.priority) as any} className="flex-shrink-0">
          {deal.priority}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-3 w-3" />
          <span className="truncate">{deal.customerName}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <DollarSign className="h-3 w-3" />
          <span className="font-semibold text-foreground">{formatCurrency(deal.value)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(deal.expectedCloseDate)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Flag className="h-3 w-3" />
          <span>{deal.productType}</span>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">Assigned to {deal.assignedTo}</p>
        </div>
      </div>
    </div>
  );
}

interface SortableDealCardProps {
  deal: Deal;
}

function SortableDealCard({ deal }: SortableDealCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <DealCard deal={deal} isDragging={isDragging} />
    </div>
  );
}

interface StageColumnProps {
  stage: DealStage;
  deals: Deal[];
  totalValue: number;
}

function StageColumn({ stage, deals, totalValue }: StageColumnProps) {
  const getStageColor = (stage: DealStage) => {
    switch (stage) {
      case 'Lead':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'Qualified':
        return 'bg-purple-500/10 border-purple-500/20';
      case 'Proposal Sent':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'Negotiation':
        return 'bg-orange-500/10 border-orange-500/20';
      case 'Won':
        return 'bg-green-500/10 border-green-500/20';
      case 'Lost':
        return 'bg-red-500/10 border-red-500/20';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className={`rounded-t-lg border p-4 ${getStageColor(stage)}`}>
        <h2 className="font-semibold text-sm mb-1">{stage}</h2>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{deals.length} deals</span>
          <span className="font-medium">{formatCurrency(totalValue)}</span>
        </div>
      </div>
      <div className="flex-1 border-x border-b rounded-b-lg bg-muted/30 p-2 min-h-[400px]">
        <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {deals.map((deal) => (
              <SortableDealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

export default function Pipeline() {
  const deals = useDealStore((state) => state.deals);
  const moveDeal = useDealStore((state) => state.moveDeal);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group deals by stage
  const dealsByStage = useMemo(() => {
    const grouped: Record<DealStage, Deal[]> = {
      Lead: [],
      Qualified: [],
      'Proposal Sent': [],
      Negotiation: [],
      Won: [],
      Lost: [],
    };

    deals.forEach((deal) => {
      grouped[deal.stage].push(deal);
    });

    return grouped;
  }, [deals]);

  // Calculate total value by stage
  const valueByStage = useMemo(() => {
    const values: Record<DealStage, number> = {
      Lead: 0,
      Qualified: 0,
      'Proposal Sent': 0,
      Negotiation: 0,
      Won: 0,
      Lost: 0,
    };

    deals.forEach((deal) => {
      values[deal.stage] += deal.value;
    });

    return values;
  }, [deals]);

  const handleDragStart = (event: DragStartEvent) => {
    const deal = deals.find((d) => d.id === event.active.id);
    setActiveDeal(deal || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveDeal(null);
      return;
    }

    const activeDeal = deals.find((d) => d.id === active.id);
    const overDeal = deals.find((d) => d.id === over.id);

    if (!activeDeal) {
      setActiveDeal(null);
      return;
    }

    // If dropped on another deal, move to that deal's stage
    if (overDeal && activeDeal.stage !== overDeal.stage) {
      moveDeal(activeDeal.id, overDeal.stage);
    }

    setActiveDeal(null);
  };

  const totalPipelineValue = deals
    .filter((d) => d.stage !== 'Won' && d.stage !== 'Lost')
    .reduce((sum, d) => sum + d.value, 0);

  const wonValue = valueByStage['Won'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-muted-foreground">Track and manage your deals</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Deal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{deals.length}</div>
            <p className="text-xs text-muted-foreground">Total Deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{formatCurrency(totalPipelineValue)}</div>
            <p className="text-xs text-muted-foreground">Pipeline Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(wonValue)}</div>
            <p className="text-xs text-muted-foreground">Won Deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {deals.filter((d) => d.stage !== 'Won' && d.stage !== 'Lost').length}
            </div>
            <p className="text-xs text-muted-foreground">Active Deals</p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Board */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Board</CardTitle>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stages.map((stage) => (
                <StageColumn
                  key={stage}
                  stage={stage}
                  deals={dealsByStage[stage]}
                  totalValue={valueByStage[stage]}
                />
              ))}
            </div>
            <DragOverlay>{activeDeal && <DealCard deal={activeDeal} />}</DragOverlay>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
}
