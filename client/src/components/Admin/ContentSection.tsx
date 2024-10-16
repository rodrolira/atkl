import { ContentSectionProps } from '@/types/props/Admin/ContentSectionProps';
import React, { ReactNode } from 'react';



const ContentSection: React.FC<ContentSectionProps> = ({ title, children }) => (
  <div className="flex flex-col items-center w-full max-w-[960px] mx-auto mb-8">
    <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
      {title}
    </h2>
    {children}
  </div>
);

export default ContentSection;
