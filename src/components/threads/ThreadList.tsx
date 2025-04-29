// src/components/threads/ThreadList.tsx
import React from 'react';
import { Thread } from '@/types/thread';
import ThreadListItem from './ThreadListItem';

interface ThreadListProps {
  threads: Thread[];
}

const ThreadList: React.FC<ThreadListProps> = ({ threads }) => {
  if (!threads || threads.length === 0) {
    return <p className="text-gray-500 text-center py-8">Bu kategoride henüz hiç konu açılmamış.</p>;
  }

  return (
    <div className="space-y-3"> {/* Konu satırları arası boşluk */}
      {threads.map(thread => (
        <ThreadListItem key={thread.id} thread={thread} />
      ))}
    </div>
  );
};

export default ThreadList;