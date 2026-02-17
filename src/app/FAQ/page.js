'use client';

import React from "react";
import "../../App.css";
import { useLanguage } from "../../LanguageContext";
import { Navigation } from "../../components/Navigation";

export default function FAQ() {
  const { t } = useLanguage();
  
  const faqData = [
    {
      question: t('faqQ1'),
      answer: t('faqA1')
    },
    {
      question: t('faqQ2'),
      answer: t('faqA2')
    },
    {
      question: t('faqQ3'),
      answer: t('faqA3')
    },
    {
      question: t('faqQ4'),
      answer: t('faqA4')
    },
    {
      question: t('faqQ5'),
      answer: t('faqA5')
    },
    {
      question: t('faqQ6'),
      answer: t('faqA6')
    },
    {
      question: t('faqQ7'),
      answer: t('faqA7')
    },
    {
      question: t('faqQ8'),
      answer: t('faqA8')
    }
  ];
  
  return (
    <>
      <Navigation />
      
      <div className="container mt-5 text-center">
        <h1 className="text-center">{t('faqTitle')}</h1>

        <div className="faq-grid">
          {faqData.map((faq, index) => (
            <div key={index} className="faq-card">
              <h3>{faq.question}</h3>
              <p style={{ whiteSpace: "pre-line" }}>{faq.answer}</p>
            </div>
          ))}
        </div>
        
        <p className="text-muted">
          © {new Date().getFullYear()} Rhythm Nexus. {t('copyrightText')}
        </p>
      </div>
    </>
  );
}
