import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { 
  Github, 
  Star, 
  GitFork, 
  ExternalLink, 
  Calendar, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import type { GitHubRepo } from '../types.ts';
import { api } from '../lib/api.ts';

interface GitHubActivityProps {
  username: string;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const headerVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const repoCardVariant: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export function GitHubActivitySection({ username }: GitHubActivityProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGitHub = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getGitHubRepos();
      setRepos(res.repos || []);
      setIsFallback(Boolean(res.fallback));
    } catch (err: any) {
      console.warn('GitHub API error:', err);
      setError('Unable to load live GitHub activity right now.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGitHub();
  }, [username]);

  const totalStars = repos.reduce((acc, r) => acc + (r.stars || 0), 0);
  const totalForks = repos.reduce((acc, r) => acc + (r.forks || 0), 0);

  return (
    <section id="github" className="py-20 border-t border-neutral-900 bg-neutral-950/80">
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div variants={headerVariant} className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Github className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                OPEN SOURCE CODE ACTIVITY
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-100 tracking-tight">
              GitHub Repositories
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <a
              id="github-profile-link"
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => api.trackEvent('github_click', `https://github.com/${username}`)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold border border-neutral-800 transition-colors"
            >
              <Github className="w-3.5 h-3.5 text-cyan-400" />
              <span>@{username}</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>

            <button
              id="github-refresh-btn"
              onClick={fetchGitHub}
              title="Refresh GitHub repositories"
              disabled={isLoading}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </motion.div>

        {/* Integration Status bar */}
        <motion.div variants={headerVariant} className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/80 mb-8 text-xs font-mono">
          <div className="flex items-center gap-2">
            {isFallback ? (
              <span className="flex items-center gap-1.5 text-amber-400">
                <AlertCircle className="w-4 h-4" />
                <span>REST API Rate-Limit Safe Fallback Active</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Live GitHub REST API Connected</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <span>Public Repositories: <strong className="text-neutral-200">{repos.length}</strong></span>
            <span>Total Stars: <strong className="text-neutral-200">{totalStars}</strong></span>
            <span>Forks: <strong className="text-neutral-200">{totalForks}</strong></span>
          </div>
        </motion.div>

        {/* Repository Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-40 rounded-xl bg-neutral-900/30 border border-neutral-800/60 animate-pulse" />
            ))}
          </div>
        ) : error && repos.length === 0 ? (
          <div className="p-8 rounded-xl bg-neutral-900/30 border border-neutral-800 text-center text-xs text-neutral-400">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map(repo => (
              <motion.a
                key={repo.id}
                variants={repoCardVariant}
                id={`github-repo-card-${repo.id}`}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => api.trackEvent('github_click', repo.url, { repo: repo.name })}
                className="group flex flex-col justify-between p-5 rounded-xl bg-neutral-900/40 border border-neutral-800/80 hover:border-cyan-500/40 transition-all duration-200 hover:bg-neutral-900/60"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-bold text-neutral-200 group-hover:text-cyan-400 transition-colors font-mono truncate">
                      {repo.name}
                    </h3>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-cyan-400 shrink-0 mt-0.5" />
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                    {repo.description || 'Open source engineering repository.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-800/60 text-xs font-mono text-neutral-400">
                  <div className="flex items-center gap-3">
                    {repo.language && (
                      <span className="flex items-center gap-1.5 text-neutral-300">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span>{repo.language}</span>
                      </span>
                    )}

                    <span className="flex items-center gap-1 text-neutral-400 hover:text-neutral-200">
                      <Star className="w-3.5 h-3.5 text-amber-400/80" />
                      <span>{repo.stars}</span>
                    </span>

                    <span className="flex items-center gap-1 text-neutral-400 hover:text-neutral-200">
                      <GitFork className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{repo.forks}</span>
                    </span>
                  </div>

                  {repo.updatedAt && (
                    <span className="flex items-center gap-1 text-[10px] text-neutral-500">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(repo.updatedAt).toLocaleDateString()}</span>
                    </span>
                  )}
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
