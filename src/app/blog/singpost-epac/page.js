'use client';

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../../../App.css";
import { useLanguage } from "../../../LanguageContext";
import { Navigation } from "../../../components/Navigation";

function BackButton() {
  const { t } = useLanguage();
  const router = useRouter();
  return (
    <button 
      onClick={() => router.back()}
      className="back-button"
    >
      <span>&larr;</span> {t('backButton')}
    </button>
  );
}

const BlogPageLayout = ({ children }) => {
  const { t } = useLanguage();
  return (
    <>
      <Navigation />
      <div className="container mt-5">
        <BackButton />
        <div className="blog-content-card">
          {children}
        </div>
        <p className="text-muted">© {new Date().getFullYear()} Rhythm Nexus. {t('copyrightText')}</p>
      </div>
    </>
  );
};

export default function SingPostEPAC() {
  const { t } = useLanguage();
  return (
    <BlogPageLayout>
      <h2>{t('blogPost1Title')}</h2>
      <p>{t('blogSingPostEPACContent1')}</p>
      <p>{t('blogSingPostEPACContent2')}</p>
      <p>{t('blogSingPostEPACContent3')}</p>
      <p>{t('blogSingPostEPACContent4')}</p>
      <p>{t('blogSingPostEPACContent5')}</p>
    </BlogPageLayout>
  );
}
