import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

export interface AdminChatMessage {
  _id: string;
  sessionId: string;
  sender: 'user' | 'assistant';
  message: string;
  messageType: 'text' | 'image' | 'file';
  metadata?: {
    userInfo?: {
      name?: string;
      email?: string;
      ipAddress?: string;
    };
    attachments?: {
      fileName: string;
      fileUrl: string;
      fileType: string;
    }[];
  };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sender?: 'all' | 'user' | 'assistant';
  isRead?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SessionStats {
  _id: string;
  messageCount: number;
  lastMessage: string;
  userInfo?: {
    name?: string;
    email?: string;
  };
}

interface AdminChatResponse {
  success: boolean;
  data: {
    messages: AdminChatMessage[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    sessionStats: SessionStats[];
  };
  error?: string;
}

export const fetchAdminChatMessages = async (params: ChatPaginationParams = {}): Promise<AdminChatResponse['data']> => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/admin/chat?${searchParams.toString()}`);
  const result: AdminChatResponse = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch chat messages');
  }

  return result.data;
};

export const markSessionsAsActive = async (sessionIds: string[], isActive: boolean = true) => {
  const response = await fetch('/api/admin/chat', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sessionIds, isActive }),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Failed to update sessions');
  }

  return result.data;
};

interface UseAdminChatReturn {
  messages: AdminChatMessage[] | undefined;
  pagination: AdminChatResponse['data']['pagination'] | undefined;
  sessionStats: SessionStats[] | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isFetching: boolean;
  markAsActive: {
    mutate: (variables: { sessionIds: string[]; isActive?: boolean }) => void;
    isPending: boolean;
    error: Error | null;
  };
}

export function useAdminChat(params: ChatPaginationParams = {}): UseAdminChatReturn {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: queryKeys.admin.chat.messages(params),
    queryFn: () => fetchAdminChatMessages(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Mark sessions as active/inactive mutation
  const markAsActiveMutation = useMutation({
    mutationFn: ({ sessionIds, isActive = true }: { sessionIds: string[]; isActive?: boolean }) =>
      markSessionsAsActive(sessionIds, isActive),
    onSuccess: () => {
      // Invalidate chat messages query to refetch updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.chat.all });
    },
  });

  return {
    messages: data?.messages,
    pagination: data?.pagination,
    sessionStats: data?.sessionStats,
    isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch chat messages') : null,
    refetch,
    isFetching,
    markAsActive: {
      mutate: markAsActiveMutation.mutate,
      isPending: markAsActiveMutation.isPending,
      error: markAsActiveMutation.error,
    },
  };
}
