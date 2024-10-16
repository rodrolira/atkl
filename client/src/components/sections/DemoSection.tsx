import React from 'react';
import Title from '@/components/atoms/Title/Title';

const DemosSection: React.FC = () => {
  return (
    <section id="demo">
      <div className="container mx-auto p-4 sm:p-16">
        <Title>Demos</Title>
        <div className="iframe-container h-full sm:h-[20%]">
          <iframe
            className="mx-auto w-3/4"
            width="600"
            height="650"
            style={{ border: '0' }} // Use inline style here
            marginWidth={0}
            marginHeight={0}
            scrolling="true"
            src="https://atklrecords.label-engine.com/demos?embed=1&bg_color=020617&text_color=ffffff&feature_color=c51616"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default DemosSection;
