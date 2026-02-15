'use client';

import React from "react";
import Link from "next/link";
import "../../App.css";
import { useLanguage } from "../../LanguageContext";
import { Navigation } from "../../components/Navigation";

function BlogIndex() {
  const { t } = useLanguage();
  
  const blogPosts = [
    {
      path: "singpost-epac",
      title: t('blogPost1Title'),
      description: t('blogPost1Desc')
    },
    {
      path: "speedpost-ems",
      title: t('blogPost2Title'),
      description: t('blogPost2Desc')
    },
    {
      path: "speedpost-express",
      title: t('blogPost3Title'),
      description: t('blogPost3Desc')
    },
    {
      path: "us-pddp",
      title: t('blogPost4Title'),
      description: t('blogPost4Desc')
    },
    {
      path: "eu-vat-ioss",
      title: t('blogPost5Title'),
      description: t('blogPost5Desc')
    },
    {
      path: "uk-vat-hmrc",
      title: t('blogPost6Title'),
      description: t('blogPost6Desc')
    },
    {
      path: "norway-voec",
      title: t('blogPost7Title'),
      description: t('blogPost7Desc')
    },
    {
      path: "swiss-vat",
      title: t('blogPost8Title'),
      description: t('blogPost8Desc')
    }
  ];

  return (
    <>
      <Navigation />
      <div className="container text-center">
        <h1 className="mt-3">{t('blogTitle')}</h1>
        <p className="text-muted mb-5">
          {t('blogSubtitle')}
        </p>

        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <div key={index} className="blog-card">
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <Link href={`/blog/${post.path}`} className="blog-link">{t('readMore')} →</Link>
            </div>
          ))}
        </div>

        <p className="text-muted">© {new Date().getFullYear()} Rhythm Nexus. {t('copyrightText')}</p>
      </div>
    </>
  );
}

export default BlogIndex;
