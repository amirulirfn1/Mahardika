import React, { useState } from 'react';

const DepartmentsSection = () => {
  const [activeTab, setActiveTab] = useState('cardiology');

  const departments = [
    {
      id: 'cardiology',
      name: 'Cardiology',
      icon: 'bi-heart-pulse',
      description: 'Our Cardiology department provides comprehensive diagnostic and therapeutic services for patients with cardiovascular diseases. Our team of cardiologists employs state-of-the-art technology to deliver exceptional heart care.',
      services: [
        'Electrocardiograms (ECG/EKG)',
        'Echocardiography',
        'Cardiac CT and MRI',
        'Cardiac catheterization',
        'Pacemaker implantation and monitoring',
        'Cardiac rehabilitation programs'
      ],
      image: '/assets/portal/img/departments-1.jpg'
    },
    {
      id: 'neurology',
      name: 'Neurology',
      icon: 'bi-lungs',
      description: 'Our Neurology department specializes in the diagnosis and treatment of disorders of the nervous system, including the brain, spinal cord, and peripheral nerves. We provide comprehensive care for a wide range of neurological conditions.',
      services: [
        'Electroencephalography (EEG)',
        'Electromyography (EMG)',
        'Nerve conduction studies',
        'Neuroimaging (MRI, CT)',
        'Treatment of stroke, epilepsy, and movement disorders',
        'Memory disorder evaluation and treatment'
      ],
      image: '/assets/portal/img/departments-2.jpg'
    },
    {
      id: 'hepatology',
      name: 'Hepatology',
      icon: 'bi-capsule',
      description: 'Our Hepatology department focuses on the study, prevention, diagnosis, and management of diseases that affect the liver, gallbladder, biliary tree, and pancreas. We provide specialized care for acute and chronic liver conditions.',
      services: [
        'Liver function tests',
        'Liver biopsy',
        'Fibroscan (liver elastography)',
        'Management of viral hepatitis',
        'Treatment of liver cirrhosis',
        'Pre and post-liver transplant care'
      ],
      image: '/assets/portal/img/departments-3.jpg'
    },
    {
      id: 'pediatrics',
      name: 'Pediatrics',
      icon: 'bi-brightness-high',
      description: 'Our Pediatrics department provides comprehensive healthcare services for infants, children, and adolescents. Our pediatricians focus on growth and development monitoring, preventive care, and treatment of childhood illnesses.',
      services: [
        'Well-child visits and immunizations',
        'Growth and development assessment',
        'Behavioral and developmental screening',
        'School and sports physicals',
        'Management of acute and chronic illnesses',
        'Adolescent health services'
      ],
      image: '/assets/portal/img/departments-4.jpg'
    },
    {
      id: 'ophthalmology',
      name: 'Ophthalmology',
      icon: 'bi-eye',
      description: 'Our Ophthalmology department specializes in the diagnosis and treatment of eye disorders. Our team of ophthalmologists provides comprehensive eye care services, from routine eye exams to complex surgical procedures.',
      services: [
        'Comprehensive eye examinations',
        'Vision testing and correction',
        'Cataract surgery',
        'Glaucoma treatment',
        'Retinal disorders diagnosis and treatment',
        'Pediatric eye care'
      ],
      image: '/assets/portal/img/departments-5.jpg'
    }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const activeDepartment = departments.find(dept => dept.id === activeTab);

  return (
    <section id="departments" className="departments">
      <div className="container">
        <div className="section-title">
          <h2>Departments</h2>
          <p>Our hospital features specialized departments with cutting-edge technology and expert healthcare professionals dedicated to providing exceptional medical care. Explore our departments to learn more about our comprehensive healthcare services.</p>
        </div>

        <div className="row gy-4">
          <div className="col-lg-3">
            <ul className="nav nav-tabs flex-column">
              {departments.map((dept) => (
                <li className="nav-item" key={dept.id}>
                  <a 
                    className={`nav-link ${activeTab === dept.id ? 'active show' : ''}`} 
                    onClick={() => handleTabClick(dept.id)}
                    href="#"
                  >
                    <i className={`bi ${dept.icon} me-2`}></i>
                    {dept.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-lg-9">
            <div className="tab-content">
              <div className="tab-pane active show">
                <div className="row gy-4">
                  <div className="col-lg-8 details order-2 order-lg-1">
                    <h3>{activeDepartment.name}</h3>
                    <p className="fst-italic">{activeDepartment.description}</p>
                    <div>
                      <h5>Our Services:</h5>
                      <ul>
                        {activeDepartment.services.map((service, index) => (
                          <li key={index}>{service}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-4 text-center order-1 order-lg-2">
                    <img 
                      src={activeDepartment.image} 
                      alt={activeDepartment.name} 
                      className="img-fluid" 
                      onError={(e) => {
                        e.target.src = "https://bootstrapmade.com/demo/templates/Medilab/assets/img/departments-1.jpg";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DepartmentsSection;
