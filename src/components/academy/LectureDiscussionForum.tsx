import React, { useState } from 'react';
import { MessageSquare, Send, ThumbsUp, UserCheck, Sparkles, CheckCircle } from 'lucide-react';
import { soundFx } from '../../lib/soundFx.ts';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  badge?: string;
  timestamp: string;
  text: string;
  likes: number;
}

const DEFAULT_COMMENTS: Comment[] = [
  {
    id: 'c1',
    author: 'Aman Sharma',
    avatar: 'AS',
    badge: 'STUDENT',
    timestamp: '2 hours ago',
    text: 'Sir, ultrasonic sensor HC-SR04 ke sath 5V logic voltage divider use karna zaroori hai agar ESP32 use karein?',
    likes: 6
  },
  {
    id: 'c2',
    author: 'Yash Gayake',
    avatar: 'YG',
    badge: 'INSTRUCTOR',
    timestamp: '1 hour ago',
    text: 'Yes Aman! ESP32 ke GPIO pins 3.3V tolerant hote hain. Ultrasonic sensor ka Echo pin 5V deta hai, isliye 1kΩ aur 2kΩ resistors se voltage divider banakar 3.3V me convert karna recommended hai taaki board safe rahe.',
    likes: 14
  },
  {
    id: 'c3',
    author: 'Priya Patel',
    avatar: 'PP',
    badge: 'STUDENT',
    timestamp: '45 mins ago',
    text: 'Thank you Yash! The ROS 2 subscriber example in this lecture made nodes and topics crystal clear.',
    likes: 4
  }
];

export function LectureDiscussionForum({ lectureTitle }: { lectureTitle: string }) {
  const [comments, setComments] = useState<Comment[]>(DEFAULT_COMMENTS);
  const [newText, setNewText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    soundFx.playClick();
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      author: authorName.trim() || 'Learner',
      avatar: (authorName.trim() || 'L').slice(0, 2).toUpperCase(),
      badge: 'STUDENT',
      timestamp: 'Just now',
      text: newText.trim(),
      likes: 0
    };

    setComments(prev => [newComment, ...prev]);
    setNewText('');
    soundFx.playSuccess();
  };

  const handleLike = (id: string) => {
    soundFx.playClick();
    setComments(prev =>
      prev.map(c => {
        if (c.id === id) {
          const isLiked = likedMap[id];
          return {
            ...c,
            likes: isLiked ? c.likes - 1 : c.likes + 1
          };
        }
        return c;
      })
    );
    setLikedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4">
      {/* Forum Header */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs sm:text-sm font-bold text-neutral-100">
            Doubt Forum & Community Q&A
          </h4>
        </div>
        <span className="text-[11px] font-mono text-cyan-400">
          {comments.length} Discussion Threads
        </span>
      </div>

      {/* Post Doubt Form */}
      <form onSubmit={handlePost} className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Your Name (e.g. Rahul)"
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
            className="sm:w-1/3 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
          />
          <input
            type="text"
            placeholder="Ask a technical question about this lecture or code..."
            value={newText}
            onChange={e => setNewText(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Doubt</span>
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-3">
        {comments.map(c => {
          const isInstructor = c.badge === 'INSTRUCTOR';
          return (
            <div
              key={c.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isInstructor
                  ? 'bg-cyan-950/20 border-cyan-500/40 shadow-sm'
                  : 'bg-neutral-950/60 border-neutral-800/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-[10px] border ${
                      isInstructor
                        ? 'bg-cyan-500 text-neutral-950 border-cyan-400'
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                    }`}
                  >
                    {c.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-200">{c.author}</span>
                      {isInstructor && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold flex items-center gap-0.5">
                          <CheckCircle className="w-2.5 h-2.5" />
                          <span>INSTRUCTOR VERIFIED</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500">{c.timestamp}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleLike(c.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                    likedMap[c.id]
                      ? 'text-cyan-400 bg-cyan-500/10'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{c.likes}</span>
                </button>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed font-sans pl-9">
                {c.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
