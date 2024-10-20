import React from 'react';
import Title from '@/components/atoms/Title/Title';
import Background from '../Layout/Background';

const DemosSection: React.FC = () => {
  return (
    <section id="demo" className='relative z-50'>
      <div className="container mx-auto p-4 sm:p-16 z-50 relative">
        <Title>Demos</Title>
        <div className="iframe-container h-full sm:h-[20%]">
          <iframe
            title="Send Demo"
            aria-label="Send Demo"
            className="mx-auto w-3/4"
            width="600"
            height="650"
            style={{ border: '0' }} // Use inline style here
            marginWidth={0}
            marginHeight={0}
            scrolling="true"
            src="https://atklrecords.label-engine.com/demos?embed=1&bg_color=000000&text_color=ffffff&feature_color=55b338"
          ></iframe>
        </div>
      </div>
      <Background />
    </section>
  );
};

export default DemosSection;
