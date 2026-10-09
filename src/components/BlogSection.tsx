import React, { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { BookOpen, Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import type { Article } from '../types.ts';
import { ArticleViewModal } from './ArticleViewModal.tsx';
import { BlogScrollProgressBar } from './BlogScrollProgressBar.tsx';
import { api } from '../lib/api.ts';

interface BlogSectionProps {
  articles: Article[];
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

const articleCardVariant: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
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

export function BlogSection({ articles }: BlogSectionProps) {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(articles.map(a => a.category)))];

  const filteredArticles = articles.filter(art => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleOpenArticle = (art: Article) => {
    setActiveArticle(art);
    api.trackEvent('blog_view', `/blog/${art.slug}`, { articleId: art.id, title: art.title });
  };

  return (
    <section id="blog" className="py-20 border-t border-neutral-900 bg-neutral-950 relative">
      {/* Subtle top viewport scroll progress bar tracking technical blog reading */}
      <BlogScrollProgressBar targetId="blog" />

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
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                ENGINEERING LOGS & WRITEUPS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-100 tracking-tight">
              Technical Blog
            </h2>
          </div>
          <p className="text-xs font-mono text-neutral-400 max-w-sm">
            In-depth architectural breakdowns, robotics sensor integration notes, and systems tutorials.
          </p>
        </motion.div>

        {/* Toolbar: Category filters & search */}
        <motion.div variants={headerVariant} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold'
                    : 'bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </motion.div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <motion.article
              key={article.id}
              variants={articleCardVariant}
              id={`blog-card-${article.id}`}
              onClick={() => handleOpenArticle(article)}
              className="group flex flex-col justify-between p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800/80 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer hover:bg-neutral-900/50"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-neutral-900 text-cyan-400 border border-neutral-800 font-semibold">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400">
                    <Clock className="w-3 h-3 text-cyan-400/80" />
                    <span>{article.readingTimeMinutes} min</span>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-neutral-100 group-hover:text-cyan-400 transition-colors mb-2 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed mb-4">
                  {article.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-950 border border-neutral-800 text-neutral-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between text-xs font-mono text-neutral-400">
                <span className="flex items-center gap-1.5 text-neutral-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{article.publishedDate}</span>
                </span>

                <span className="inline-flex items-center gap-1 text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.article>
          ))}

          {filteredArticles.length === 0 && (
            <div className="col-span-full p-10 rounded-2xl bg-neutral-900/20 border border-neutral-800 text-center text-xs text-neutral-400">
              No technical articles found matching your criteria.
            </div>
          )}
        </div>
      </motion.div>

      <ArticleViewModal
        article={activeArticle}
        onClose={() => setActiveArticle(null)}
      />
    </section>
  );
}
