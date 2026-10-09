import React from 'react';
import { motion, type Variants } from 'motion/react';
import { Award, ExternalLink, FileText, Calendar } from 'lucide-react';
import type { Certification } from '../types.ts';

interface CertificationsSectionProps {
  certifications: Certification[];
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

const certCardVariant: Variants = {
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

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  return (
    <section id="certifications" className="py-20 border-t border-neutral-900 bg-neutral-950">
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
              <Award className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                VALIDATED EXPERTISE
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-100 tracking-tight">
              Certifications & Credentials
            </h2>
          </div>
          <p className="text-xs font-mono text-neutral-400 max-w-sm">
            Technical accreditations, verified course completions, and certified engineering assessments.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, idx) => (
            <motion.div
              key={cert.id || idx}
              variants={certCardVariant}
              id={`cert-card-${cert.id}`}
              className="p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800/80 hover:border-neutral-700/80 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-900 text-cyan-400 border border-neutral-800 font-semibold">
                    {cert.issuingOrganization || 'Verified Issuer'}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-neutral-500">
                    <Calendar className="w-3 h-3" />
                    <span>{cert.issueDate}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-neutral-100 mb-1">
                  {cert.name}
                </h3>

                {cert.credentialId && (
                  <p className="text-[11px] font-mono text-neutral-400 mb-3">
                    ID: {cert.credentialId}
                  </p>
                )}

                {/* Related Skills */}
                {cert.relatedSkills && cert.relatedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 mb-4">
                    {cert.relatedSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-950 border border-neutral-800 text-neutral-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Links */}
              <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between">
                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-[11px] font-mono text-neutral-500">
                    Direct Record
                  </span>
                )}

                {cert.certificateFileUrl && (
                  <a
                    href={cert.certificateFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Document</span>
                  </a>
                )}
              </div>
            </motion.div>
          ))}

          {certifications.length === 0 && (
            <div className="col-span-full p-8 rounded-xl bg-neutral-900/20 border border-neutral-800 text-center text-xs text-neutral-500">
              No certifications listed yet. Admin can upload certificates with credentials and PDFs.
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
